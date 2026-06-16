import './TextDisplay.scss'
import { useTypistStore } from '@/store/useTypistStore.ts'
import {useEffect, useState} from 'react'

const TextDisplay = () => {
	const [currentLetterIndex, setCurrentLetterIndex] = useState<number>(0)
	const { currentText, currentWordIndex, nextWord, generateWords } = useTypistStore()
	
	const handleKeyPress = (event : KeyboardEvent) : void => {
		const letter = event.key
		if (letter.length === 1 || letter === ' ') {
			if (currentText[currentWordIndex].length === currentLetterIndex && letter === ' ') {
				console.log("Пробел")
				nextWord()
				setCurrentLetterIndex(0)
			}
			if (letter === currentText[currentWordIndex][currentLetterIndex]) {
				if (currentWordIndex + 1 === currentText.length && currentLetterIndex === currentText[currentWordIndex].length - 1) {
					generateWords()
					setCurrentLetterIndex(0)
					return
				}
				console.log("Правильная буква")
				setCurrentLetterIndex(currentLetterIndex + 1)
			}
		}
	}
	
	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress)
		
		return () => {
			window.removeEventListener('keydown', handleKeyPress)
		}
	}, [currentLetterIndex, currentLetterIndex, nextWord, generateWords ])
	
	return (
		<div
			className="text-display"
		>
			{currentText.map((word, index) => (
				<span className={`text-display__word ${currentWordIndex === index ? 'active' : ''}`}
				      key={index}
				>{word} </span>
			))}
		</div>
	)
}

export default TextDisplay