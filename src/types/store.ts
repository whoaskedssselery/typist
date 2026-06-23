import type { Status } from '@/types/index.ts'

export type Store = {
	correctChars: number
	incorrectChars: number
	unlockedLetters: string[]
	currentText: string[]
	currentWordIndex: number
	wpm: number
	statusArray: Array<Status>
	currentLetter: string
	incorrectLetter: string
	targetLetterCorrect: number
	targetLetterTotal: number
	wpmList: Array<number>
	wpmMax: number
	sessionCounter: number
	newlyUnlockedLetter: string | null
	nextWord: () => void
	generateWords: () => void
	setStatusByIndex: (index: number, status: Status) => void
	resetStatus: () => void
	setCurrentLetter: (letter: string) => void
	setIncorrectLetter: (letter: string) => void
	setWpm: (wpm: number) => void
	resetProgress: () => void
	clearUnlockedNotification: () => void
}
