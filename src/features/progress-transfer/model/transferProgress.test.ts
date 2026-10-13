import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/entities/typist/api/db'
import { listSessions, saveSession } from '@/entities/typist/api/sessionsRepo'
import { useTypistStoreEn, useTypistStoreRu } from '@/entities/typist/model/useTypistStore'
import { exportProgress, importProgress } from './transferProgress'

const session = (language: 'ru' | 'en', wpm: number) => ({
	language,
	finishedAt: 1_700_000_000_000 + wpm,
	durationMs: 20_000,
	wpm,
	accuracy: 0.96,
	correct: 60,
	errors: 2,
	letters: {},
})

beforeEach(async () => {
	useTypistStoreRu.getState().reset()
	useTypistStoreEn.getState().reset()
	await db.sessions.clear()
})

describe('exportProgress', () => {
	it('contains the progress of both languages', async () => {
		useTypistStoreRu.setState({ sessionCounter: 7 })
		useTypistStoreEn.setState({ sessionCounter: 3 })

		const file = JSON.parse(await exportProgress())

		expect(file.languages.ru.sessionCounter).toBe(7)
		expect(file.languages.en.sessionCounter).toBe(3)
	})

	it('does not leak the running session or UI flags', async () => {
		const file = JSON.parse(await exportProgress())

		expect(file.languages.ru.session).toBeUndefined()
		expect(file.languages.ru.incorrectLetter).toBeUndefined()
	})

	it('includes the session history', async () => {
		await saveSession(session('ru', 40))
		await saveSession(session('en', 25))

		const file = JSON.parse(await exportProgress())

		expect(file.sessions.map((entry: { wpm: number }) => entry.wpm).sort()).toEqual([25, 40])
	})
})

describe('importProgress', () => {
	it('applies the progress to each language in the file', async () => {
		useTypistStoreRu.setState({ sessionCounter: 9, wpmMax: 55 })
		const text = await exportProgress()
		useTypistStoreRu.getState().reset()
		useTypistStoreEn.getState().reset()

		const result = await importProgress(text)

		expect(result).toEqual({ ok: true, languages: ['ru', 'en'] })
		expect(useTypistStoreRu.getState().sessionCounter).toBe(9)
		expect(useTypistStoreRu.getState().wpmMax).toBe(55)
	})

	it('restores the session history of the imported languages', async () => {
		await saveSession(session('ru', 40))
		const text = await exportProgress()
		await db.sessions.clear()
		await saveSession(session('ru', 5))

		await importProgress(text)

		expect((await listSessions('ru')).map((entry) => entry.wpm)).toEqual([40])
	})

	it('keeps the current history when the file has none for a language', async () => {
		const text = await exportProgress()
		const file = JSON.parse(text)
		file.sessions = []
		await saveSession(session('ru', 12))

		await importProgress(JSON.stringify(file))

		expect((await listSessions('ru')).map((entry) => entry.wpm)).toEqual([12])
	})

	it('leaves everything untouched when the file is invalid', async () => {
		useTypistStoreRu.setState({ sessionCounter: 4 })
		await saveSession(session('ru', 12))

		const result = await importProgress('{"format":"nope"}')

		expect(result).toEqual({ ok: false, error: 'invalid-format' })
		expect(useTypistStoreRu.getState().sessionCounter).toBe(4)
		expect(await listSessions('ru')).toHaveLength(1)
	})
})
