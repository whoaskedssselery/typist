import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { russianWords } from '@/constants/words.ts'
import type { Status, Theme } from '@/types'

type Store = {
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

export const useTypistStore  = create<Store>()(
	persist(
		(set) => ({
			theme: 'light',
			correctChars: 0,
			incorrectChars: 0,
			unlockedLetters: ["а", "т", "и", "о", "е", "н"],
			currentText: ['тано', 'ана', 'тонна', 'има', 'антенна', 'нота'],
			currentWordIndex: 0,
			errors: {},
			wpm: 0,
			statusArray: [],
			currentLetter: '',
			incorrectLetter: '',
			dailyGoal: 30,
			todayMinutes: 0,
			lastSessionDate: null,
			nextWord: () => set((state) => ({ currentWordIndex: state.currentWordIndex + 1 })),
			generateWords: () => set((state) => {
				const list: string[] = []
				const filtered = russianWords.filter(word => word.split('').every(letter => state.unlockedLetters.includes(letter)))
				
				while (list.length < 20) {
					const index = Math.floor(Math.random() * filtered.length)
					list.push(filtered[index])
					filtered.splice(index, 1)
				}
				
				return { currentText: list , currentWordIndex: 0, statusArray: [] }
			}),
			setStatusByIndex: (index: number, status: Status) => set((state) => {
				const next = [...state.statusArray]
				next[index] = status
				return {
					statusArray: next,
					correctChars: status === 'correct' ? state.correctChars + 1 : state.correctChars,
					incorrectChars: status === 'incorrect' ? state.incorrectChars + 1 : state.incorrectChars
				}
			}),
			resetStatus: () => set(() => ({ statusArray: [] })),
			setCurrentLetter: (letter: string) => set(() => ({ currentLetter: letter })),
			setIncorrectLetter: (letter: string) => set(() => ({ incorrectLetter: letter })),
			toggleTheme: () => set((state) => ({ theme:  state.theme === 'light' ? 'dark' : 'light' })),
			setWpm: (wpm: number) => set(() => ({ wpm })),
			addMinute: () => set((state) => {
				const today = new Date().toDateString()
				const last = state.lastSessionDate?.toDateString()
				
				return {
					todayMinutes: last !== today ? 1 : state.todayMinutes + 1,
					lastSessionDate: new Date(),
				}
			}),
			resetDailyGoal: () => set(() => ({
				todayMinutes: 0,
			}))
		}),
		{
			name: 'typist-store',
			partialize: (state) => ({
				theme: state.theme,
				unlockedLetters: state.unlockedLetters,
				dailyGoal: state.dailyGoal,
				todayMinutes: state.todayMinutes,
				lastSessionDate: state.lastSessionDate,
			})
		}
	)
)

