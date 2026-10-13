import { beforeEach, describe, expect, it } from 'vitest'
import { useTypistStoreEn, useTypistStoreRu } from '@/entities/typist/model/useTypistStore'
import { exportProgress, importProgress } from './transferProgress'

beforeEach(() => {
	useTypistStoreRu.getState().reset()
	useTypistStoreEn.getState().reset()
})

describe('exportProgress', () => {
	it('contains the progress of both languages', () => {
		useTypistStoreRu.setState({ sessionCounter: 7 })
		useTypistStoreEn.setState({ sessionCounter: 3 })

		const file = JSON.parse(exportProgress())

		expect(file.languages.ru.sessionCounter).toBe(7)
		expect(file.languages.en.sessionCounter).toBe(3)
	})

	it('does not leak the running session or UI flags', () => {
		const file = JSON.parse(exportProgress())

		expect(file.languages.ru.session).toBeUndefined()
		expect(file.languages.ru.incorrectLetter).toBeUndefined()
	})
})

describe('importProgress', () => {
	it('applies the progress to each language in the file', () => {
		useTypistStoreRu.setState({ sessionCounter: 9, wpmMax: 55 })
		const text = exportProgress()
		useTypistStoreRu.getState().reset()
		useTypistStoreEn.getState().reset()

		const result = importProgress(text)

		expect(result).toEqual({ ok: true, languages: ['ru', 'en'] })
		expect(useTypistStoreRu.getState().sessionCounter).toBe(9)
		expect(useTypistStoreRu.getState().wpmMax).toBe(55)
	})

	it('leaves everything untouched when the file is invalid', () => {
		useTypistStoreRu.setState({ sessionCounter: 4 })

		const result = importProgress('{"format":"nope"}')

		expect(result).toEqual({ ok: false, error: 'invalid-format' })
		expect(useTypistStoreRu.getState().sessionCounter).toBe(4)
	})
})
