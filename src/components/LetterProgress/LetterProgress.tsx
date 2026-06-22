import { russianLetters } from '@/constants/russianStore/russianLetters.ts'
import { englishLetters } from '@/constants/englishStore/englishLetters.ts'
import { useSettingsStore } from '@/store/useSettingsStore.ts'
import useActiveStore from '@/hooks/useActiveStore.ts'
import './LetterProgress.scss'

const LetterProgress = () => {
	const { language } = useSettingsStore()
	const { unlockedLetters } = useActiveStore()
	
	const letters = language === 'ru' ? russianLetters : englishLetters
	
	return (
		<ul
			className="letter-progress"
		>
			{letters.map((letter) => (
				<li className={`letter-progress__key ${unlockedLetters.includes(letter) ? 'letter-progress__key--unlocked' : ''}`}
				    key={letter}
				>{letter.toUpperCase()}</li>
			))}
		</ul>
	)
}

export default LetterProgress