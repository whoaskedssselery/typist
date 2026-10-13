import { describe, expect, it } from 'vitest'
import type { LetterEvent } from './progress'
import { summarizeLetters } from './summary'

describe('summarizeLetters', () => {
	it('is empty without events', () => {
		expect(summarizeLetters([])).toEqual({})
	})

	it('counts hits and misses per letter', () => {
		const events: LetterEvent[] = [
			{ letter: 'а', correct: true, ms: 300 },
			{ letter: 'а', correct: false, ms: null },
			{ letter: 'б', correct: true, ms: 200 },
		]

		const summary = summarizeLetters(events)

		expect(summary.а.hits).toBe(1)
		expect(summary.а.misses).toBe(1)
		expect(summary.б.hits).toBe(1)
		expect(summary.б.misses).toBe(0)
	})

	it('sums timing only for timed hits', () => {
		const events: LetterEvent[] = [
			{ letter: 'а', correct: true, ms: null },
			{ letter: 'а', correct: true, ms: 300 },
			{ letter: 'а', correct: true, ms: 500 },
		]

		const { а } = summarizeLetters(events)

		expect(а.timed).toBe(2)
		expect(а.totalMs).toBe(800)
		expect(а.hits).toBe(3)
	})
})
