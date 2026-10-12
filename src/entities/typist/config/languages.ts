import { englishLetters } from './english/englishLetters'
import { englishWords } from './english/englishWords'
import { russianLetters } from './russian/russianLetters'
import { russianWords } from './russian/russianWords'

export const INITIAL_LETTER_COUNT = 6

export const languages = {
	ru: { order: russianLetters, words: russianWords },
	en: { order: englishLetters, words: englishWords },
}
