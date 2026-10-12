import { describe, expect, it } from 'vitest'
import { DEFAULT_CONFIG } from './config'
import { generateSet } from './generator'
import { createRng } from './random'

const dictionary = [
	'тон',
	'нота',
	'тина',
	'они',
	'она',
	'ион',
	'тот',
	'отец',
	'тени',
	'нить',
	'нота',
	'оттенок',
	'антон',
	'интонация',
	'тонна',
	'анти',
	'типон',
	'ента',
	'рота',
	'тара',
	'арт',
	'отар',
	'тире',
	'ритон',
	'нитро',
	'интро',
	'натр',
	'роен',
	'тетрис',
	'риота',
	'тарна',
	'нирот',
	'тори',
	'рита',
	'трон',
	'терен',
]

const unlocked = ['а', 'т', 'и', 'о', 'е', 'н', 'р']

const onlyUnlocked = (word: string, letters: string[]) =>
	[...word].every((letter) => letters.includes(letter))

const build = (overrides: Partial<Parameters<typeof generateSet>[0]> = {}) =>
	generateSet({
		words: dictionary,
		unlocked,
		focus: null,
		config: DEFAULT_CONFIG,
		rng: createRng(1),
		...overrides,
	})

describe('generateSet', () => {
	it('returns exactly the configured number of words', () => {
		expect(build()).toHaveLength(20)
		expect(build({ config: { ...DEFAULT_CONFIG, setSize: 7 } })).toHaveLength(7)
	})

	it('only uses unlocked letters', () => {
		for (const word of build()) expect(onlyUnlocked(word, unlocked)).toBe(true)
	})

	it('does not repeat words when the pool is large enough', () => {
		const set = build()

		expect(new Set(set).size).toBe(set.length)
	})

	it('puts the focus letter into most of the words', () => {
		const set = build({ focus: 'р' })
		const withFocus = set.filter((word) => word.includes('р'))

		expect(withFocus.length / set.length).toBeGreaterThanOrEqual(0.6)
	})

	it('is reproducible for the same seed', () => {
		expect(build({ rng: createRng(7) })).toEqual(build({ rng: createRng(7) }))
	})

	it('differs between seeds', () => {
		expect(build({ rng: createRng(7) })).not.toEqual(build({ rng: createRng(8) }))
	})

	it('fills a small pool with pseudo-words made of unlocked letters', () => {
		const letters = ['а', 'т', 'и']
		const set = build({ unlocked: letters, focus: 'и' })

		expect(set).toHaveLength(20)
		for (const word of set) {
			expect(word.length).toBeGreaterThan(0)
			expect(onlyUnlocked(word, letters)).toBe(true)
		}
	})

	it('never returns an empty set when the dictionary has no matching words', () => {
		const letters = ['ф', 'ы']
		const set = build({ unlocked: letters, focus: 'ф' })

		expect(set).toHaveLength(20)
		for (const word of set) expect(onlyUnlocked(word, letters)).toBe(true)
	})

	it('favours the focus letter in pseudo-words too', () => {
		const letters = ['ф', 'ы', 'в']
		const set = build({ unlocked: letters, focus: 'в' })
		const withFocus = set.filter((word) => word.includes('в'))

		expect(withFocus.length / set.length).toBeGreaterThanOrEqual(0.6)
	})

	it('rejects an empty alphabet', () => {
		expect(() => build({ unlocked: [] })).toThrow()
	})
})
