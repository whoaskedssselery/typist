import type { EngineConfig } from './config'
import type { LetterEvent } from './progress'

export type SessionStatus = 'idle' | 'running' | 'done'

export type SessionState = {
	words: string[]
	wordIndex: number
	charIndex: number
	status: SessionStatus
	cursorErrored: boolean
	lastKeyAt: number | null
	activeMs: number
	correct: number
	errors: number
	events: LetterEvent[]
}

export const createSession = (words: string[]): SessionState => ({
	words,
	wordIndex: 0,
	charIndex: 0,
	status: words.length === 0 ? 'done' : 'idle',
	cursorErrored: false,
	lastKeyAt: null,
	activeMs: 0,
	correct: 0,
	errors: 0,
	events: [],
})

export const expectedChar = (state: SessionState): string | null => {
	if (state.status === 'done') return null
	const word = state.words[state.wordIndex]
	return state.charIndex < word.length ? word[state.charIndex] : ' '
}

export const typeChar = (
	state: SessionState,
	key: string,
	now: number,
	config: EngineConfig,
): SessionState => {
	const expected = expectedChar(state)
	if (expected === null) return state

	const delta = state.lastKeyAt === null ? null : now - state.lastKeyAt
	const withinIdle = delta !== null && delta <= config.idleMs
	const activeMs = state.activeMs + (withinIdle ? delta : 0)
	const isLetter = expected !== ' '

	if (key.toLowerCase() !== expected) {
		return {
			...state,
			status: 'running',
			cursorErrored: true,
			lastKeyAt: now,
			activeMs,
			errors: state.errors + 1,
			events: isLetter
				? [...state.events, { letter: expected, correct: false, ms: null }]
				: state.events,
		}
	}

	const word = state.words[state.wordIndex]
	const isLastWord = state.wordIndex === state.words.length - 1
	const finishedWord = state.charIndex + 1 === word.length
	const done = isLastWord && finishedWord

	return {
		...state,
		status: done ? 'done' : 'running',
		wordIndex: expected === ' ' ? state.wordIndex + 1 : state.wordIndex,
		charIndex: expected === ' ' ? 0 : state.charIndex + 1,
		cursorErrored: false,
		lastKeyAt: now,
		activeMs,
		correct: state.correct + 1,
		events: isLetter
			? [...state.events, { letter: expected, correct: true, ms: withinIdle ? delta : null }]
			: state.events,
	}
}

export const sessionWpm = (state: SessionState) =>
	state.activeMs === 0 ? 0 : state.correct / 5 / (state.activeMs / 60000)

export const sessionAccuracy = (state: SessionState) => {
	const total = state.correct + state.errors
	return total === 0 ? 0 : state.correct / total
}
