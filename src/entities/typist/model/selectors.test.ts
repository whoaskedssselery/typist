import { describe, expect, it } from 'vitest'
import { createSession, DEFAULT_CONFIG, typeChar } from '@/entities/typist/core'
import { selectAccuracyPercent, selectWpm } from './selectors'
import type { TypistState } from './types'

const stateWith = (overrides: Partial<TypistState>) => overrides as TypistState

const typed = (keys: string, step = 600) =>
	[...keys].reduce(
		(session, key, index) => typeChar(session, key, index * step, DEFAULT_CONFIG),
		createSession(['a'.repeat(50)]),
	)

describe('selectWpm', () => {
	it('shows the live WPM of the running set', () => {
		const session = typed('aaaaaa')

		expect(selectWpm(stateWith({ session, lastResult: null }))).toBe(
			Math.round(6 / 5 / ((5 * 600) / 60000)),
		)
	})

	it('falls back to the last finished set before the new one has speed', () => {
		const session = typed('a')

		expect(selectWpm(stateWith({ session, lastResult: { wpm: 42, accuracy: 1 } }))).toBe(42)
	})

	it('is zero with no history', () => {
		expect(selectWpm(stateWith({ session: typed(''), lastResult: null }))).toBe(0)
	})
})

describe('selectAccuracyPercent', () => {
	it('shows the live accuracy of the running set', () => {
		const session = typed('axaa')

		expect(selectAccuracyPercent(stateWith({ session, lastResult: null }))).toBe(75)
	})

	it('falls back to the last finished set before any key is pressed', () => {
		const state = stateWith({ session: typed(''), lastResult: { wpm: 30, accuracy: 0.9 } })

		expect(selectAccuracyPercent(state)).toBe(90)
	})

	it('is zero with no history', () => {
		expect(selectAccuracyPercent(stateWith({ session: typed(''), lastResult: null }))).toBe(0)
	})
})
