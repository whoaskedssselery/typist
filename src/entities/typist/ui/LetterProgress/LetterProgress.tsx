import { englishLetters } from '@/entities/typist/config/english/englishLetters.ts'
import { russianLetters } from '@/entities/typist/config/russian/russianLetters.ts'
import useActiveStore from '@/entities/typist/model/useActiveStore'
import { useSettingsStore } from '@/shared/store/useSettingsStore'
import './LetterProgress.scss'

const LetterProgress = () => {
	const { language } = useSettingsStore()
	const { unlockedLetters } = useActiveStore()

	const letters = language === 'ru' ? russianLetters : englishLetters

	return (
		<ul className="letter-progress">
			{letters.map((letter) => (
				<li
					className={`letter-progress__key ${unlockedLetters.includes(letter) ? 'letter-progress__key--unlocked' : ''}`}
					key={letter}
				>
					{letter.toUpperCase()}
				</li>
			))}
		</ul>
	)
}

export default LetterProgress
