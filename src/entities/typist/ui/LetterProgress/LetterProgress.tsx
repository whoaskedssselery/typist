import { languages } from '@/entities/typist/config/languages'
import { useActiveStore } from '@/entities/typist/model/useActiveStore'
import { useSettingsStore } from '@/shared/store/useSettingsStore'
import './LetterProgress.scss'

const LetterProgress = () => {
	const language = useSettingsStore((state) => state.language)
	const unlockedLetters = useActiveStore((state) => state.progress.unlocked)

	const letters = languages[language].order

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
