import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Status } from '@/types'
import type { Store } from '@/types/store.ts'
import { russianWords } from '@/constants/russianStore/russianWords.ts'
import { russianLetters } from '@/constants/russianStore/russianLetters.ts'
import {englishWords} from '@/constants/englishStore/englishWords.ts'
import {englishLetters} from '@/constants/englishStore/englishLetters.ts'
import toast from 'react-hot-toast'

export const useTypistStoreRu  = create<Store>()(
	persist(
		(set) => ({
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
			targetLetterCorrect: 0,
			targetLetterTotal: 0,
			wpmList: [],
			wpmMax: 0,
			sessionCounter: 0,
			nextWord: () => set((state) => ({ currentWordIndex: state.currentWordIndex + 1 })),
			generateWords: () => set((state) => {
				let newUnlocked = state.unlockedLetters
				
				if (state.targetLetterCorrect / state.targetLetterTotal >= 0.8) {
					const newLetter = russianLetters.find(letter => !state.unlockedLetters.includes(letter))
					if (newLetter) {
						newUnlocked = [...newUnlocked, newLetter]
						toast.success(`Вы открыли букву ${newLetter.toUpperCase()}`)
					}
				}
				
				const allUnlocked = newUnlocked.length === russianLetters.length
				
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
					sessionCounter: state.wpm > 0 ? state.sessionCounter + 1 : state.sessionCounter,
					wpmList: state.wpm > 0 ? [...state.wpmList, state.wpm] : state.wpmList,
					wpmMax: Math.max(state.wpmMax, state.wpm),
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
			setWpm: (wpm: number) => set(() => ({
					wpm,
				})
			),
			resetProgress: () => set(() => {
				toast.success('Настройки успешно сброшены')
				
				return {
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
					targetLetterCorrect: 0,
					targetLetterTotal: 0,
				}
			}),
			addWpmToList: (currentWpm: number) => set((state) => ({ wpmList: [...state.wpmList, currentWpm] })),
		}),
		{
			name: 'typist-store-ru',
			partialize: (state) => ({
				unlockedLetters: state.unlockedLetters,
				wpmList: state.wpmList,
				wpmMax: state.wpmMax,
				sessionCounter: state.sessionCounter,
			})
		}
	)
)

export const useTypistStoreEn  = create<Store>()(
	persist(
		(set) => ({
			correctChars: 0,
			incorrectChars: 0,
			unlockedLetters: ['e', 'n', 'i', 'a', 'r', 'l'],
			currentText: [],
			currentWordIndex: 0,
			errors: {},
			wpm: 0,
			statusArray: [],
			currentLetter: '',
			incorrectLetter: '',
			targetLetterCorrect: 0,
			targetLetterTotal: 0,
			wpmList: [],
			wpmMax: 0,
			sessionCounter: 0,
			nextWord: () => set((state) => ({ currentWordIndex: state.currentWordIndex + 1 })),
			generateWords: () => set((state) => {
				let newUnlocked = state.unlockedLetters
				
				if (state.targetLetterCorrect / state.targetLetterTotal >= 0.8) {
					const newLetter = englishLetters.find(letter => !state.unlockedLetters.includes(letter))
					if (newLetter) {
						newUnlocked = [...newUnlocked, newLetter]
						toast.success(`Вы открыли букву ${newLetter.toUpperCase()}`)
					}
				}
				
				const allUnlocked = newUnlocked.length === englishLetters.length
				
				const list: string[] = []
				const filtered = englishWords.filter(word => word.split('').every(letter => newUnlocked.includes(letter)) && (allUnlocked || word.includes(newUnlocked[newUnlocked.length - 1])))
				
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
					sessionCounter: state.wpm > 0 ? state.sessionCounter + 1 : state.sessionCounter,
					wpmList: state.wpm > 0 ? [...state.wpmList, state.wpm] : state.wpmList,
					wpmMax: Math.max(state.wpmMax, state.wpm),
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
			setWpm: (wpm: number) => set(() => ({
					wpm,
				})
			),
			resetProgress: () => set(() => {
				toast.success('Настройки успешно сброшены')
				
				return {
					correctChars: 0,
					incorrectChars: 0,
					unlockedLetters: ['e', 'n', 'i', 'a', 'r', 'l'],
					currentText: [],
					currentWordIndex: 0,
					errors: {},
					wpm: 0,
					statusArray: [],
					currentLetter: '',
					incorrectLetter: '',
					targetLetterCorrect: 0,
					targetLetterTotal: 0,
				}
			}),
			addWpmToList: (currentWpm: number) => set((state) => ({ wpmList: [...state.wpmList, currentWpm] })),
		}),
		{
			name: 'typist-store-en',
			partialize: (state) => ({
				unlockedLetters: state.unlockedLetters,
				wpmList: state.wpmList,
				wpmMax: state.wpmMax,
				sessionCounter: state.sessionCounter,
			})
		}
	)
)