import './LetterProgress.scss'
import { letters } from '@/constants/letters.ts'
import {useTypistStore} from '@/store/useTypistStore.ts'

const LetterProgress = () => {
	const { unlockedLetters } = useTypistStore()
	
	console.log(unlockedLetters, letters)
	
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