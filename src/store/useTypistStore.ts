import { create } from 'zustand'
import {russianWords} from '@/constants/words.ts'

type Store = {
	unlockedLetters: string[],
	currentText: string[],
	currentWordIndex: number,
	errors: Record<string, number>,
	wpm: number,
	nextWord: () => void,
	generateWords: () => void,
}

export const useTypistStore  = create<Store>()((set) => ({
	unlockedLetters: ["а", "т", "и", "о", "е", "н"],
	currentText: ['тано', 'ана', 'тонна', 'има', 'антенна', 'нота'],
	currentWordIndex: 0,
	errors: {},
	wpm: 0,
	nextWord: () => set((state) => ({ currentWordIndex: state.currentWordIndex + 1 })),
	generateWords: () => set((state) => {
		const list: string[] = []
		const filtered = russianWords.filter(word => word.split('').every(letter => state.unlockedLetters.includes(letter)))
		
		while (list.length < 20) {
			const index = Math.floor(Math.random() * filtered.length)
			list.push(filtered[index])
			filtered.splice(index, 1)
		}
		
		return { currentText: list , currentWordIndex: 0 }
	}),
}))

