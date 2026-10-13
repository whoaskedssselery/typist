import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from './db'
import {
	activeMsSince,
	allSessions,
	clearSessions,
	listSessions,
	replaceSessions,
	type SessionRecord,
	saveSession,
} from './sessionsRepo'

const record = (overrides: Partial<SessionRecord> = {}): SessionRecord => ({
	language: 'ru',
	finishedAt: 1000,
	durationMs: 30_000,
	wpm: 40,
	accuracy: 0.95,
	correct: 100,
	errors: 5,
	letters: { а: { hits: 3, misses: 1, timed: 2, totalMs: 600 } },
	...overrides,
})

beforeEach(async () => {
	vi.restoreAllMocks()
	await db.sessions.clear()
})

describe('saveSession and listSessions', () => {
	it('stores a session and reads it back for its language', async () => {
		expect(await saveSession(record())).toBe(true)

		const sessions = await listSessions('ru')

		expect(sessions).toHaveLength(1)
		expect(sessions[0]).toMatchObject({ wpm: 40, language: 'ru' })
		expect(sessions[0].id).toBeTypeOf('number')
	})

	it('keeps languages apart', async () => {
		await saveSession(record({ language: 'ru' }))
		await saveSession(record({ language: 'en' }))

		expect(await listSessions('en')).toHaveLength(1)
		expect(await listSessions('ru')).toHaveLength(1)
	})

	it('returns sessions in the order they finished', async () => {
		await saveSession(record({ finishedAt: 3000, wpm: 3 }))
		await saveSession(record({ finishedAt: 1000, wpm: 1 }))
		await saveSession(record({ finishedAt: 2000, wpm: 2 }))

		const wpms = (await listSessions('ru')).map((session) => session.wpm)

		expect(wpms).toEqual([1, 2, 3])
	})
})

describe('activeMsSince', () => {
	it('adds up the typing time of all languages since a moment', async () => {
		await saveSession(record({ finishedAt: 500, durationMs: 10_000 }))
		await saveSession(record({ finishedAt: 2000, durationMs: 20_000, language: 'ru' }))
		await saveSession(record({ finishedAt: 3000, durationMs: 5_000, language: 'en' }))

		expect(await activeMsSince(1000)).toBe(25_000)
	})

	it('is zero when nothing was typed', async () => {
		expect(await activeMsSince(0)).toBe(0)
	})
})

describe('clearSessions', () => {
	it('removes only the sessions of one language', async () => {
		await saveSession(record({ language: 'ru' }))
		await saveSession(record({ language: 'en' }))

		await clearSessions('ru')

		expect(await listSessions('ru')).toHaveLength(0)
		expect(await listSessions('en')).toHaveLength(1)
	})
})

describe('when IndexedDB fails', () => {
	it('does not throw and reports a failed save', async () => {
		vi.spyOn(db.sessions, 'add').mockRejectedValue(new Error('quota'))

		expect(await saveSession(record())).toBe(false)
	})

	it('falls back to empty reads', async () => {
		vi.spyOn(db.sessions, 'where').mockImplementation(() => {
			throw new Error('blocked')
		})

		expect(await listSessions('ru')).toEqual([])
		expect(await activeMsSince(0)).toBe(0)
	})
})

describe('allSessions and replaceSessions', () => {
	it('reads every session of every language', async () => {
		await saveSession(record({ language: 'ru' }))
		await saveSession(record({ language: 'en' }))

		expect(await allSessions()).toHaveLength(2)
	})

	it('swaps the history of one language and leaves the other', async () => {
		await saveSession(record({ language: 'ru', wpm: 10 }))
		await saveSession(record({ language: 'en', wpm: 20 }))

		const ok = await replaceSessions('ru', [record({ language: 'ru', wpm: 99 })])

		expect(ok).toBe(true)
		expect((await listSessions('ru')).map((session) => session.wpm)).toEqual([99])
		expect((await listSessions('en')).map((session) => session.wpm)).toEqual([20])
	})

	it('keeps the old history when the replacement fails', async () => {
		await saveSession(record({ language: 'ru', wpm: 10 }))
		vi.spyOn(db.sessions, 'bulkAdd').mockRejectedValue(new Error('quota'))

		const ok = await replaceSessions('ru', [record({ language: 'ru', wpm: 99 })])

		expect(ok).toBe(false)
		expect((await listSessions('ru')).map((session) => session.wpm)).toEqual([10])
	})
})
