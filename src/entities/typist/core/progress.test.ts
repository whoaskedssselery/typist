import { describe, expect, it } from 'vitest'
import { DEFAULT_CONFIG } from './config'
import {
	applyEvents,
	finishSet,
	focusLetter,
	initialProgress,
	isMastered,
	type LetterEvent,
} from './progress'

const order = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const config = { ...DEFAULT_CONFIG, minSamples: 5, window: 10 }

const hits = (letter: string, count: number, ms: number): LetterEvent[] =>
	Array.from({ length: count }, () => ({ letter, correct: true, ms }))

const masterAll = (letters: string[]) => letters.flatMap((letter) => hits(letter, 5, 300))

describe('initialProgress', () => {
	it('unlocks the first letters of the order', () => {
		const progress = initialProgress(order, 3)

		expect(progress.unlocked).toEqual(['a', 'b', 'c'])
		expect(progress.stats).toEqual({})
	})
})

describe('isMastered', () => {
	const progressFor = (events: LetterEvent[]) =>
		applyEvents(initialProgress(order, 1), events, config).stats.a

	it('needs enough samples', () => {
		expect(isMastered(progressFor(hits('a', 4, 300)), config)).toBe(false)
	})

	it('is true for enough fast and accurate hits', () => {
		expect(isMastered(progressFor(hits('a', 5, 300)), config)).toBe(true)
	})

	it('is false when slower than the target speed', () => {
		expect(isMastered(progressFor(hits('a', 5, 900)), config)).toBe(false)
	})

	it('is false when accuracy is too low', () => {
		const events = [
			...hits('a', 5, 300),
			{ letter: 'a', correct: false, ms: null },
			{ letter: 'a', correct: false, ms: null },
		]

		expect(isMastered(progressFor(events), config)).toBe(false)
	})

	it('is false for a letter that was never typed', () => {
		expect(isMastered(undefined, config)).toBe(false)
	})
})

describe('applyEvents', () => {
	it('records hits and misses on the right letter', () => {
		const progress = applyEvents(
			initialProgress(order, 2),
			[...hits('a', 2, 400), { letter: 'b', correct: false, ms: null }],
			config,
		)

		expect(progress.stats.a.hits).toBe(2)
		expect(progress.stats.b.misses).toBe(1)
	})

	it('ignores letters that are not unlocked', () => {
		const progress = applyEvents(initialProgress(order, 1), hits('z', 3, 400), config)

		expect(progress.stats.z).toBeUndefined()
	})

	it('does not mutate the previous progress', () => {
		const before = initialProgress(order, 1)
		applyEvents(before, hits('a', 3, 400), config)

		expect(before.stats).toEqual({})
	})
})

describe('focusLetter', () => {
	it('prefers a letter that was never measured', () => {
		const progress = applyEvents(initialProgress(order, 2), hits('a', 5, 300), config)

		expect(focusLetter(progress, config)).toBe('b')
	})

	it('picks the slowest measured letter', () => {
		const progress = applyEvents(
			initialProgress(order, 2),
			[...hits('a', 5, 300), ...hits('b', 5, 700)],
			config,
		)

		expect(focusLetter(progress, config)).toBe('b')
	})

	it('breaks ties in favour of the most recently unlocked letter', () => {
		expect(focusLetter(initialProgress(order, 3), config)).toBe('c')
	})

	it('is null when every unlocked letter is mastered', () => {
		const progress = applyEvents(initialProgress(order, 2), masterAll(['a', 'b']), config)

		expect(focusLetter(progress, config)).toBeNull()
	})
})

describe('finishSet', () => {
	it('unlocks the next letter once all unlocked letters are mastered', () => {
		const result = finishSet(initialProgress(order, 2), masterAll(['a', 'b']), order, config)

		expect(result.unlockedLetter).toBe('c')
		expect(result.progress.unlocked).toEqual(['a', 'b', 'c'])
	})

	it('keeps the letters when one is still weak', () => {
		const events = [...hits('a', 5, 300), ...hits('b', 5, 900)]
		const result = finishSet(initialProgress(order, 2), events, order, config)

		expect(result.unlockedLetter).toBeNull()
		expect(result.progress.unlocked).toEqual(['a', 'b'])
	})

	it('unlocks at most one letter per set', () => {
		const result = finishSet(initialProgress(order, 2), masterAll(['a', 'b', 'c']), order, config)

		expect(result.progress.unlocked).toHaveLength(3)
	})

	it('stops when the whole alphabet is unlocked', () => {
		const result = finishSet(initialProgress(order, 8), masterAll(order), order, config)

		expect(result.unlockedLetter).toBeNull()
		expect(result.progress.unlocked).toHaveLength(8)
	})
})
