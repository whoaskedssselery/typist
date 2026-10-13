import type { Progress, SessionState } from '@/entities/typist/core'

export type SessionResult = { wpm: number; accuracy: number }

export type PersistedTypist = {
	progress: Progress
	wpmList: number[]
	wpmMax: number
	sessionCounter: number
}

export type TypistState = PersistedTypist & {
	session: SessionState
	lastResult: SessionResult | null
	newlyUnlockedLetter: string | null
	incorrectLetter: string
	lastKeyAt: number | null
	start: () => void
	press: (key: string, now: number) => void
	restart: () => void
	clearUnlocked: () => void
	importData: (data: PersistedTypist) => void
	reset: () => void
}
