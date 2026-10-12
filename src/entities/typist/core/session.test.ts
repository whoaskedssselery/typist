import { describe, expect, it } from 'vitest'
import { DEFAULT_CONFIG } from './config'
import {
	createSession,
	expectedChar,
	type SessionState,
	sessionAccuracy,
	sessionWpm,
	typeChar,
} from './session'

const type = (state: SessionState, keys: string, startAt = 0, step = 100) =>
	[...keys].reduce(
		(current, key, index) => typeChar(current, key, startAt + index * step, DEFAULT_CONFIG),
		state,
	)

describe('expectedChar', () => {
	it('walks through letters, spaces and the next word', () => {
		let state = createSession(['ab', 'c'])
		const seen: (string | null)[] = []
		for (const key of 'ab c') {
			seen.push(expectedChar(state))
			state = typeChar(state, key, 0, DEFAULT_CONFIG)
		}

		expect(seen).toEqual(['a', 'b', ' ', 'c'])
		expect(expectedChar(state)).toBeNull()
	})
})

describe('typeChar', () => {
	it('advances on a correct key', () => {
		const state = typeChar(createSession(['ab']), 'a', 0, DEFAULT_CONFIG)

		expect(expectedChar(state)).toBe('b')
		expect(state.correct).toBe(1)
		expect(state.status).toBe('running')
	})

	it('stays in place and counts an error on a wrong key', () => {
		const state = typeChar(createSession(['ab']), 'x', 0, DEFAULT_CONFIG)

		expect(expectedChar(state)).toBe('a')
		expect(state.errors).toBe(1)
		expect(state.events).toEqual([{ letter: 'a', correct: false, ms: null }])
	})

	it('matches regardless of case', () => {
		const state = typeChar(createSession(['да']), 'Д', 0, DEFAULT_CONFIG)

		expect(expectedChar(state)).toBe('а')
	})

	it('treats a space in the middle of a word as an error', () => {
		const state = typeChar(createSession(['ab']), ' ', 0, DEFAULT_CONFIG)

		expect(state.errors).toBe(1)
		expect(expectedChar(state)).toBe('a')
	})

	it('records the time between consecutive correct keys', () => {
		const state = type(createSession(['abc']), 'abc', 0, 250)

		expect(state.events.map((event) => event.ms)).toEqual([null, 250, 250])
	})

	it('drops the timing of a key typed after a long pause', () => {
		let state = typeChar(createSession(['ab']), 'a', 0, DEFAULT_CONFIG)
		state = typeChar(state, 'b', 10_000, DEFAULT_CONFIG)

		expect(state.events[1].ms).toBeNull()
	})

	it('does not record letter events for spaces', () => {
		const state = type(createSession(['a', 'b']), 'a ', 0)

		expect(state.events.map((event) => event.letter)).toEqual(['a'])
		expect(expectedChar(state)).toBe('b')
	})
})

describe('finishing a set', () => {
	it('does not finish when the last character is wrong', () => {
		const state = type(createSession(['ab']), 'ax')

		expect(state.status).toBe('running')
		expect(state.errors).toBe(1)
		expect(expectedChar(state)).toBe('b')
		expect(state.events.at(-1)).toEqual({ letter: 'b', correct: false, ms: null })
	})

	it('finishes right after the last correct character', () => {
		const state = type(createSession(['ab', 'c']), 'ab c')

		expect(state.status).toBe('done')
		expect(state.correct).toBe(4)
	})

	it('ignores input after the set is done', () => {
		const done = type(createSession(['a']), 'a')
		const after = typeChar(done, 'z', 5000, DEFAULT_CONFIG)

		expect(after).toEqual(done)
	})
})

describe('sessionWpm', () => {
	it('is zero before there is any active time', () => {
		expect(sessionWpm(createSession(['abc']))).toBe(0)
		expect(sessionWpm(typeChar(createSession(['abc']), 'a', 0, DEFAULT_CONFIG))).toBe(0)
	})

	it('counts correct characters per active minute', () => {
		const state = type(createSession(['a'.repeat(10)]), 'a'.repeat(10), 0, 600)

		expect(sessionWpm(state)).toBeCloseTo(10 / 5 / ((9 * 600) / 60000), 5)
	})

	it('does not count a long pause as typing time', () => {
		let state = createSession(['a'.repeat(100)])
		state = type(state, 'a'.repeat(50), 0, 600)
		state = type(state, 'a'.repeat(50), 29_400 + 60_000, 600)

		expect(sessionWpm(state)).toBeCloseTo(20.4, 1)
	})
})

describe('sessionAccuracy', () => {
	it('is the share of correct key presses', () => {
		const state = type(createSession(['abcd']), 'axbc')

		expect(sessionAccuracy(state)).toBeCloseTo(3 / 4)
	})

	it('is zero before any key press', () => {
		expect(sessionAccuracy(createSession(['a']))).toBe(0)
	})
})
