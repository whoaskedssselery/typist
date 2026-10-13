import { describe, expect, it } from 'vitest'
import { buildExport, MAX_IMPORT_BYTES, parseImport, parsePersisted } from './progressFile'
import type { PersistedTypist } from './types'

const sample = (unlocked: string[]): PersistedTypist => ({
	progress: {
		unlocked,
		stats: { а: { hits: 3, misses: 1, avgMs: 350.5, recent: [true, true, false, true] } },
	},
	wpmList: [20, 31],
	wpmMax: 31,
	sessionCounter: 2,
})

describe('parsePersisted', () => {
	it('accepts valid data', () => {
		const valid = sample(['а', 'т'])

		expect(parsePersisted(valid)).toEqual({ ok: true, data: valid })
	})

	it('allows a letter that was never timed', () => {
		const data = sample(['а'])
		data.progress.stats.а.avgMs = null

		expect(parsePersisted(data).ok).toBe(true)
	})

	it.each([
		['not an object', 'oops'],
		['null', null],
		['no unlocked letters', { ...sample([]) }],
		['a negative count', { ...sample(['а']), sessionCounter: -1 }],
		['a non-numeric wpm entry', { ...sample(['а']), wpmList: [20, 'fast'] }],
		[
			'broken stats',
			{ ...sample(['а']), progress: { unlocked: ['а'], stats: { а: { hits: 'x' } } } },
		],
		['an NaN wpm', { ...sample(['а']), wpmMax: Number.NaN }],
	])('rejects %s', (_, value) => {
		expect(parsePersisted(value).ok).toBe(false)
	})
})

describe('export and import', () => {
	const now = new Date('2026-10-13T10:00:00.000Z')

	it('round-trips both languages', () => {
		const ru = sample(['а', 'т'])
		const en = sample(['e', 'n'])

		const result = parseImport(buildExport({ ru, en }, now))

		expect(result).toEqual({ ok: true, languages: { ru, en }, sessions: [] })
	})

	it('labels the file so it is recognisable', () => {
		const file = JSON.parse(buildExport({ ru: sample(['а']) }, now))

		expect(file.format).toBe('typist-progress')
		expect(file.version).toBe(1)
		expect(file.exportedAt).toBe(now.toISOString())
	})

	it('imports a file that only has one language', () => {
		const ru = sample(['а'])

		const result = parseImport(buildExport({ ru }, now))

		expect(result).toEqual({ ok: true, languages: { ru }, sessions: [] })
	})

	it('round-trips the session history', () => {
		const sessions = [
			{
				language: 'ru' as const,
				finishedAt: 1_700_000_000_000,
				durationMs: 20_000,
				wpm: 41,
				accuracy: 0.97,
				correct: 80,
				errors: 3,
				letters: { а: { hits: 4, misses: 1, timed: 3, totalMs: 900 } },
			},
		]

		const result = parseImport(buildExport({ ru: sample(['а']) }, now, sessions))

		expect(result).toMatchObject({ ok: true, sessions })
	})

	it('rejects a file with a malformed session', () => {
		const file = JSON.parse(buildExport({ ru: sample(['а']) }, now))
		file.sessions = [{ language: 'ru', wpm: 'fast' }]

		expect(parseImport(JSON.stringify(file))).toEqual({ ok: false, error: 'invalid-format' })
	})

	it('drops ids so imported sessions get fresh ones', () => {
		const withId = {
			id: 99,
			language: 'ru' as const,
			finishedAt: 1,
			durationMs: 1,
			wpm: 1,
			accuracy: 1,
			correct: 1,
			errors: 0,
			letters: {},
		}

		const result = parseImport(buildExport({ ru: sample(['а']) }, now, [withId]))

		expect(result.ok && result.sessions[0]).not.toHaveProperty('id')
	})

	it('rejects text that is not JSON', () => {
		expect(parseImport('not json')).toEqual({ ok: false, error: 'invalid-json' })
	})

	it('rejects a JSON file from some other app', () => {
		expect(parseImport(JSON.stringify({ hello: 'world' }))).toEqual({
			ok: false,
			error: 'invalid-format',
		})
	})

	it('rejects a file with corrupted progress and applies nothing', () => {
		const file = JSON.parse(buildExport({ ru: sample(['а']) }, now))
		file.languages.ru.wpmList = ['x']

		expect(parseImport(JSON.stringify(file))).toEqual({ ok: false, error: 'invalid-format' })
	})

	it('rejects a file with no languages', () => {
		const file = JSON.parse(buildExport({ ru: sample(['а']) }, now))
		file.languages = {}

		expect(parseImport(JSON.stringify(file))).toEqual({ ok: false, error: 'invalid-format' })
	})

	it('rejects a file that is too large', () => {
		expect(parseImport('x'.repeat(MAX_IMPORT_BYTES + 1))).toEqual({ ok: false, error: 'too-large' })
	})

	it('rejects a newer file version', () => {
		const file = JSON.parse(buildExport({ ru: sample(['а']) }, now))
		file.version = 2

		expect(parseImport(JSON.stringify(file))).toEqual({ ok: false, error: 'unsupported-version' })
	})
})
