import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { russianWords } from '@/constants/words.ts'
import type { Store, Status } from '@/types'
import { letters } from '@/constants/letters.ts'
import toast from 'react-hot-toast'

export const useTypistStore  = create<Store>()(
	persist(
		(set) => ({
			theme: 'light',
			fontSize: 'M',
			textFontFamily: 'JetBrains Mono',
			correctChars: 0,
			incorrectChars: 0,
			unlockedLetters: ["а", "т", "и", "о", "е", "н"],
			currentText: [],
			currentWordIndex: 0,
			errors: {},
			wpm: 0,
			statusArray: [],
			currentLetter: '',
			incorrectLetter: '',
			dailyGoal: 30,
			todayMinutes: 0,
			lastSessionDate: null,
			targetLetterCorrect: 0,
			targetLetterTotal: 0,
			nextWord: () => set((state) => ({ currentWordIndex: state.currentWordIndex + 1 })),
			generateWords: () => set((state) => {
				let newUnlocked = state.unlockedLetters
				
				if (state.targetLetterCorrect / state.targetLetterTotal >= 0.8) {
					const newLetter = letters.find(letter => !state.unlockedLetters.includes(letter))
					if (newLetter) {
						newUnlocked = [...newUnlocked, newLetter]
						toast.success(`Вы открыли букву ${newLetter.toUpperCase()}`)
					}
				}
				
				const allUnlocked = newUnlocked.length === letters.length
				
				const list: string[] = []
				const filtered = russianWords.filter(word => word.split('').every(letter => newUnlocked.includes(letter)) && (allUnlocked || word.includes(newUnlocked[newUnlocked.length - 1])))
				
				while (list.length < 20 && filtered.length > 0) {
					const index = Math.floor(Math.random() * filtered.length)
					list.push(filtered[index])
					filtered.splice(index, 1)
				}
				
				return {
					currentText: list,
					currentWordIndex: 0,
					statusArray: [],
					unlockedLetters: newUnlocked,
					targetLetterCorrect: 0,
					targetLetterTotal: 0,
				}
			}),
			setStatusByIndex: (index: number, status: Status) => set((state) => {
				const targetLetter = state.unlockedLetters[state.unlockedLetters.length - 1]
				const isTargetLetter = state.currentLetter === targetLetter
				
				const isCorrect = status === 'correct'
				const nextStatus = [...state.statusArray]
				nextStatus[index] = status
				
				return {
					statusArray: nextStatus,
					correctChars: isCorrect ? state.correctChars + 1 : state.correctChars,
					incorrectChars: !isCorrect ? state.incorrectChars + 1 : state.incorrectChars,
					targetLetterTotal: isTargetLetter ? state.targetLetterTotal + 1 : state.targetLetterTotal,
					targetLetterCorrect: isTargetLetter && isCorrect ? state.targetLetterCorrect + 1: state.targetLetterCorrect,
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
			})),
			resetProgress: () => set(() => {
				toast.success('Настройки успешно сброшены')
				
				return {
					theme: 'light',
					correctChars: 0,
					incorrectChars: 0,
					unlockedLetters: ["а", "т", "и", "о", "е", "н"],
					currentText: [],
					currentWordIndex: 0,
					errors: {},
					wpm: 0,
					statusArray: [],
					currentLetter: '',
					incorrectLetter: '',
					dailyGoal: 30,
					todayMinutes: 0,
					lastSessionDate: new Date(),
					targetLetterCorrect: 0,
					targetLetterTotal: 0,
				}
			}),
			setFontSize: (newFontSize) => set(() => {
				toast.success(`Вы успешно поменяли размер текста на ${newFontSize}`)
				return {
					fontSize: newFontSize
				}
			}),
			setFontFamily: (newFontFamily) => {
				set(() => {
					document.documentElement.style.setProperty('--font-text', newFontFamily)
					toast.success(`Вы успешно поменяли шрифт на ${newFontFamily}`)
					return { textFontFamily: newFontFamily }
				})
			},
		}),
		{
			name: 'typist-store',
			partialize: (state) => ({
				theme: state.theme,
				unlockedLetters: state.unlockedLetters,
				dailyGoal: state.dailyGoal,
				todayMinutes: state.todayMinutes,
				lastSessionDate: state.lastSessionDate,
				fontSize: state.fontSize,
				textFontFamily: state.textFontFamily,
			})
		}
	)
)