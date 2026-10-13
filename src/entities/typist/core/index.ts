export { DEFAULT_CONFIG, type EngineConfig } from './config'
export { generateSet } from './generator'
export { isForeignLayout } from './layout'
export {
	accuracy,
	confidence,
	emptyStats,
	type LetterStats,
	recordHit,
	recordMiss,
	targetMs,
} from './letterStats'
export {
	applyEvents,
	finishSet,
	focusLetter,
	initialProgress,
	isMastered,
	type LetterEvent,
	type Progress,
} from './progress'
export { createRng, type Rng } from './random'
export {
	createSession,
	expectedChar,
	type SessionState,
	type SessionStatus,
	sessionAccuracy,
	sessionWpm,
	typeChar,
} from './session'
export { type LetterSummary, summarizeLetters } from './summary'
