import type { EngineConfig } from './config'

export type LetterStats = {
	hits: number
	misses: number
	avgMs: number | null
	recent: boolean[]
}

export const emptyStats = (): LetterStats => ({ hits: 0, misses: 0, avgMs: null, recent: [] })

export const targetMs = (targetWpm: number) => 60000 / (targetWpm * 5)

const pushRecent = (recent: boolean[], outcome: boolean, window: number) =>
	[...recent, outcome].slice(-window)

export const recordHit = (
	stats: LetterStats,
	ms: number | null,
	config: EngineConfig,
): LetterStats => {
	let avgMs = stats.avgMs
	if (ms !== null) {
		avgMs = avgMs === null ? ms : avgMs + (ms - avgMs) * config.emaAlpha
	}
	return {
		hits: stats.hits + 1,
		misses: stats.misses,
		avgMs,
		recent: pushRecent(stats.recent, true, config.window),
	}
}

export const recordMiss = (stats: LetterStats, config: EngineConfig): LetterStats => ({
	hits: stats.hits,
	misses: stats.misses + 1,
	avgMs: stats.avgMs,
	recent: pushRecent(stats.recent, false, config.window),
})

export const accuracy = (stats: LetterStats) => {
	if (stats.recent.length === 0) return 0
	return stats.recent.filter(Boolean).length / stats.recent.length
}

export const confidence = (stats: LetterStats, targetWpm: number) =>
	stats.avgMs === null ? 0 : targetMs(targetWpm) / stats.avgMs
