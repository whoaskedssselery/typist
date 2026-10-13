import type { LetterEvent } from './progress'

export type LetterSummary = { hits: number; misses: number; timed: number; totalMs: number }

export const summarizeLetters = (events: LetterEvent[]): Record<string, LetterSummary> => {
	const summary: Record<string, LetterSummary> = {}
	for (const event of events) {
		const letter = summary[event.letter] ?? { hits: 0, misses: 0, timed: 0, totalMs: 0 }
		summary[event.letter] = letter
		if (!event.correct) {
			letter.misses += 1
			continue
		}
		letter.hits += 1
		if (event.ms !== null) {
			letter.timed += 1
			letter.totalMs += event.ms
		}
	}
	return summary
}
