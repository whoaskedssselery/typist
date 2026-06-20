export interface Route {
	label: string;
	path: string;
}

export type Status = 'correct' | 'incorrect'
export type Theme = 'light' | 'dark'

export type Store = {
	theme: Theme,
	correctChars: number,
	incorrectChars: number,
	unlockedLetters: string[],
	currentText: string[],
	currentWordIndex: number,
	errors: Record<string, number>,
	wpm: number,
	statusArray: Array<Status>,
	currentLetter: string,
	incorrectLetter: string,
	dailyGoal: number,
	todayMinutes: number,
	lastSessionDate: Date | null,
	targetLetterCorrect: number,
	targetLetterTotal: number,
	nextWord: () => void,
	generateWords: () => void,
	setStatusByIndex: (index: number, status: Status) => void,
	resetStatus: () => void,
	setCurrentLetter: (letter: string) => void,
	setIncorrectLetter: (letter: string) => void,
	toggleTheme: () => void,
	setWpm: (wpm: number) => void,
	addMinute: () => void,
	resetDailyGoal: () => void,
}