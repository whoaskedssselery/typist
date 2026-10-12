export type EngineConfig = {
	targetWpm: number
	minAccuracy: number
	minSamples: number
	window: number
	emaAlpha: number
	idleMs: number
	focusRatio: number
	setSize: number
}

export const DEFAULT_CONFIG: EngineConfig = {
	targetWpm: 30,
	minAccuracy: 0.9,
	minSamples: 10,
	window: 30,
	emaAlpha: 0.2,
	idleMs: 3000,
	focusRatio: 0.7,
	setSize: 20,
}
