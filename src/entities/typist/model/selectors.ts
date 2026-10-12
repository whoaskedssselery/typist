import { sessionAccuracy, sessionWpm } from '@/entities/typist/core'
import type { TypistState } from './types'

export const selectWpm = (state: TypistState) =>
	state.session.activeMs > 0 ? Math.round(sessionWpm(state.session)) : (state.lastResult?.wpm ?? 0)

export const selectAccuracyPercent = (state: TypistState) => {
	const { correct, errors } = state.session
	if (correct + errors > 0) return Math.round(sessionAccuracy(state.session) * 100)
	return Math.round((state.lastResult?.accuracy ?? 0) * 100)
}
