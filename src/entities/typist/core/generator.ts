import type { EngineConfig } from './config'
import type { Rng } from './random'

type GenerateOptions = {
	words: string[]
	unlocked: string[]
	focus: string | null
	config: EngineConfig
	rng: Rng
}

const START = '^'
const END = '$'
const MIN_LENGTH = 3
const MAX_LENGTH = 7
const FOCUS_CANDIDATES = 12
const UNIQUE_ATTEMPTS = 50

const pick = <T>(items: T[], rng: Rng): T => items[Math.floor(rng() * items.length)]

const shuffle = <T>(items: T[], rng: Rng): T[] => {
	const result = [...items]
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}

const buildTransitions = (pool: string[]) => {
	const transitions = new Map<string, string[]>()
	const add = (from: string, to: string) => {
		const list = transitions.get(from)
		if (list) list.push(to)
		else transitions.set(from, [to])
	}
	for (const word of pool) {
		let previous = START
		for (const letter of word) {
			add(previous, letter)
			previous = letter
		}
		add(previous, END)
	}
	return transitions
}

const randomLetters = (unlocked: string[], rng: Rng) => {
	const length = MIN_LENGTH + Math.floor(rng() * 4)
	return Array.from({ length }, () => pick(unlocked, rng)).join('')
}

const markovWord = (transitions: Map<string, string[]>, rng: Rng) => {
	let word = ''
	let current = START
	while (word.length < MAX_LENGTH) {
		const next = pick(transitions.get(current) ?? [END], rng)
		if (next === END) break
		word += next
		current = next
	}
	return word
}

const pseudoWord = (
	transitions: Map<string, string[]>,
	unlocked: string[],
	focus: string | null,
	rng: Rng,
) => {
	let candidate = ''
	for (let i = 0; i < FOCUS_CANDIDATES; i++) {
		const word =
			transitions.size === 0 ? randomLetters(unlocked, rng) : markovWord(transitions, rng)
		if (word.length < MIN_LENGTH) continue
		candidate = word
		if (focus === null || word.includes(focus)) return word
	}
	return candidate || randomLetters(unlocked, rng)
}

export const generateSet = ({ words, unlocked, focus, config, rng }: GenerateOptions): string[] => {
	if (unlocked.length === 0) throw new Error('Cannot generate words without unlocked letters')

	const pool = [...new Set(words)].filter((word) => [...word].every((l) => unlocked.includes(l)))
	const withFocus = shuffle(focus === null ? [] : pool.filter((word) => word.includes(focus)), rng)
	const others = shuffle(
		pool.filter((word) => !withFocus.includes(word)),
		rng,
	)

	const focusTarget = focus === null ? 0 : Math.round(config.setSize * config.focusRatio)
	const picked = withFocus.slice(0, focusTarget)
	picked.push(...others.slice(0, config.setSize - picked.length))
	picked.push(...withFocus.slice(focusTarget).slice(0, config.setSize - picked.length))

	if (picked.length < config.setSize) {
		const transitions = buildTransitions(pool)
		const seen = new Set(picked)
		while (picked.length < config.setSize) {
			let word = pseudoWord(transitions, unlocked, focus, rng)
			for (let attempt = 0; seen.has(word) && attempt < UNIQUE_ATTEMPTS; attempt++) {
				word = pseudoWord(transitions, unlocked, focus, rng)
			}
			seen.add(word)
			picked.push(word)
		}
	}

	return shuffle(picked, rng)
}
