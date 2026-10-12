import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Status } from '@/entities/typist/model/types'
import type { Store } from '@/entities/typist/model/types'
import { russianWords } from '@/entities/typist/config/russian/russianWords.ts'
import { russianLetters } from '@/entities/typist/config/russian/russianLetters.ts'
import { englishWords } from '@/entities/typist/config/english/englishWords.ts'
import { englishLetters } from '@/entities/typist/config/english/englishLetters.ts'

type StoreConfig = {
	name: string
	initialLetters: string[]
	letters: string[]
	words: string[]
}

const createTypistStore = ({ name, initialLetters, letters, words }: StoreConfig) =>
	create<Store>()(
		persist(
			(set) => ({
				correctChars: 0,
				incorrectChars: 0,
				unlockedLetters: initialLetters,
				currentText: [],
				currentWordIndex: 0,
				wpm: 0,
				statusArray: [],
				currentLetter: '',
				incorrectLetter: '',
				targetLetterCorrect: 0,
				targetLetterTotal: 0,
				wpmList: [],
				wpmMax: 0,
				sessionCounter: 0,
				newlyUnlockedLetter: null,

				nextWord: () => set((state) => ({ currentWordIndex: state.currentWordIndex + 1 })),

				generateWords: () =>
					set((state) => {
						let newUnlocked = state.unlockedLetters
						let newlyUnlockedLetter: string | null = null

						if (
							state.targetLetterTotal > 0 &&
							state.targetLetterCorrect / state.targetLetterTotal >= 0.8
						) {
							const next = letters.find((l) => !state.unlockedLetters.includes(l))
							if (next) {
								newUnlocked = [...newUnlocked, next]
								newlyUnlockedLetter = next
							}
						}

						const allUnlocked = newUnlocked.length === letters.length
						const pool = words.filter(
							(word) =>
								word.split('').every((l) => newUnlocked.includes(l)) &&
								(allUnlocked || word.includes(newUnlocked[newUnlocked.length - 1])),
						)

						const list: string[] = []
						const available = [...pool]
						while (list.length < 20 && available.length > 0) {
							const index = Math.floor(Math.random() * available.length)
							list.push(available[index])
							available.splice(index, 1)
						}

						return {
							currentText: list,
							currentWordIndex: 0,
							statusArray: [],
							unlockedLetters: newUnlocked,
							targetLetterCorrect: 0,
							targetLetterTotal: 0,
							newlyUnlockedLetter,
							sessionCounter: state.wpm > 0 ? state.sessionCounter + 1 : state.sessionCounter,
							wpmList: state.wpm > 0 ? [...state.wpmList, state.wpm] : state.wpmList,
							wpmMax: Math.max(state.wpmMax, state.wpm),
						}
					}),

				setStatusByIndex: (index: number, status: Status) =>
					set((state) => {
						const targetLetter = state.unlockedLetters[state.unlockedLetters.length - 1]
						const isTargetLetter = state.currentLetter === targetLetter
						const isCorrect = status === 'correct'
						const nextStatus = [...state.statusArray]
						nextStatus[index] = status

						return {
							statusArray: nextStatus,
							correctChars: isCorrect ? state.correctChars + 1 : state.correctChars,
							incorrectChars: !isCorrect ? state.incorrectChars + 1 : state.incorrectChars,
							targetLetterTotal: isTargetLetter
								? state.targetLetterTotal + 1
								: state.targetLetterTotal,
							targetLetterCorrect:
								isTargetLetter && isCorrect
									? state.targetLetterCorrect + 1
									: state.targetLetterCorrect,
						}
					}),

				resetStatus: () => set(() => ({ statusArray: [] })),
				setCurrentLetter: (letter: string) => set(() => ({ currentLetter: letter })),
				setIncorrectLetter: (letter: string) => set(() => ({ incorrectLetter: letter })),
				setWpm: (wpm: number) => set(() => ({ wpm })),
				clearUnlockedNotification: () => set(() => ({ newlyUnlockedLetter: null })),

				resetProgress: () =>
					set(() => ({
						correctChars: 0,
						incorrectChars: 0,
						unlockedLetters: initialLetters,
						currentText: [],
						currentWordIndex: 0,
						wpm: 0,
						statusArray: [],
						currentLetter: '',
						incorrectLetter: '',
						targetLetterCorrect: 0,
						targetLetterTotal: 0,
						newlyUnlockedLetter: null,
					})),
			}),
			{
				name,
				partialize: (state) => ({
					unlockedLetters: state.unlockedLetters,
					wpmList: state.wpmList,
					wpmMax: state.wpmMax,
					sessionCounter: state.sessionCounter,
				}),
			},
		),
	)

export const useTypistStoreRu = createTypistStore({
	name: 'typist-store-ru',
	initialLetters: ['а', 'т', 'и', 'о', 'е', 'н'],
	letters: russianLetters,
	words: russianWords,
})

export const useTypistStoreEn = createTypistStore({
	name: 'typist-store-en',
	initialLetters: ['e', 'n', 'i', 'a', 'r', 'l'],
	letters: englishLetters,
	words: englishWords,
})
