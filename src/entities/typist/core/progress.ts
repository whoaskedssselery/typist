import type { EngineConfig } from './config'
import {
	accuracy,
	confidence,
	emptyStats,
	type LetterStats,
	recordHit,
	recordMiss,
} from './letterStats'

export type LetterEvent = { letter: string; correct: boolean; ms: number | null }

export type Progress = {
	unlocked: string[]
	stats: Record<string, LetterStats>
}

export const initialProgress = (order: string[], initialCount: number): Progress => ({
	unlocked: order.slice(0, initialCount),
	stats: {},
})

export const isMastered = (stats: LetterStats | undefined, config: EngineConfig) =>
	stats !== undefined &&
	stats.recent.length >= config.minSamples &&
	confidence(stats, config.targetWpm) >= 1 &&
	accuracy(stats) >= config.minAccuracy

export const applyEvents = (
	progress: Progress,
	events: LetterEvent[],
	config: EngineConfig,
): Progress => {
	const stats = { ...progress.stats }
	for (const event of events) {
		if (!progress.unlocked.includes(event.letter)) continue
		const current = stats[event.letter] ?? emptyStats()
		stats[event.letter] = event.correct
			? recordHit(current, event.ms, config)
			: recordMiss(current, config)
	}
	return { unlocked: progress.unlocked, stats }
}

export const focusLetter = (progress: Progress, config: EngineConfig): string | null => {
	if (progress.unlocked.every((letter) => isMastered(progress.stats[letter], config))) return null

	let focus = progress.unlocked[0]
	let lowest = Number.POSITIVE_INFINITY
	for (const letter of progress.unlocked) {
		const stats = progress.stats[letter]
		const value = stats ? confidence(stats, config.targetWpm) : 0
		if (value <= lowest) {
			lowest = value
			focus = letter
		}
	}
	return focus
}

export const finishSet = (
	progress: Progress,
	events: LetterEvent[],
	order: string[],
	config: EngineConfig,
): { progress: Progress; unlockedLetter: string | null } => {
	const updated = applyEvents(progress, events, config)
	const allMastered = updated.unlocked.every((letter) => isMastered(updated.stats[letter], config))
	const next = order.find((letter) => !updated.unlocked.includes(letter))

	if (!allMastered || next === undefined) return { progress: updated, unlockedLetter: null }
	return {
		progress: { unlocked: [...updated.unlocked, next], stats: updated.stats },
		unlockedLetter: next,
	}
}
