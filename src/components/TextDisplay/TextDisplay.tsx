import './TextDisplay.scss'
import { useTypistStore } from '@/store/useTypistStore.ts'
import { useEffect, useRef, useState } from 'react'

const TextDisplay = () => {
	const [cursorIndex, setCursorIndex] = useState<number>(0)
	
	const {
		currentText, currentWordIndex, nextWord,
		generateWords, statusArray, setStatusByIndex,
		resetStatus, setCurrentLetter, setIncorrectLetter,
		correctChars, setWpm
	} = useTypistStore()
	
	const letterIndexRef = useRef(0)
	const startTime = useRef<number | null>(null)
	const correctCharsRef = useRef<number>(0)
	const lastKeyTimeRef = useRef<number>(Date.now())
	
	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === ' ') event.preventDefault()
		
		if (event.key === ' ' || event.key.length === 1) {
			if (!startTime.current) startTime.current = Date.now()
			lastKeyTimeRef.current = Date.now()
			
			if (currentText.length === currentWordIndex + 1 && currentText[currentWordIndex].length - 1 === letterIndexRef.current) {
				generateWords()
				setCursorIndex(0)
				letterIndexRef.current = 0
				setCurrentLetter(currentText[0][0])
				return
			}
			
			if (currentText[currentWordIndex].length === letterIndexRef.current && event.key === ' ') {
				nextWord()
				resetStatus()
				setCursorIndex(0)
				letterIndexRef.current = 0
				setCurrentLetter(currentText[currentWordIndex + 1][0])
				return
			}
			
			if (currentText[currentWordIndex][letterIndexRef.current] === event.key) {
				setStatusByIndex(letterIndexRef.current, 'correct')
				letterIndexRef.current = letterIndexRef.current + 1
				setCursorIndex(prevState => prevState + 1)
				
				if (letterIndexRef.current === currentText[currentWordIndex].length) {
					setCurrentLetter(" ")
					return
				}
				
				setCurrentLetter(currentText[currentWordIndex][letterIndexRef.current])
			} else {
				setStatusByIndex(letterIndexRef.current, 'incorrect')
				setIncorrectLetter(event.key)
				setTimeout(() => {
					setIncorrectLetter('')
				}, 700)
			}
		}
	}
	
	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress)
		
		return () => {
			window.removeEventListener('keydown', handleKeyPress)
		}
	}, [currentText, currentWordIndex])
	useEffect(() => {
		correctCharsRef.current = correctChars
	}, [correctChars])
	useEffect(() => {
		const interval = setInterval(() => {
			if (startTime.current) {
				const wpm = Math.round((correctCharsRef.current / 5) / ((Date.now() - startTime.current) / 60000))
				setWpm(wpm)
			}
		}, 2000)
		const resetInterval =  setInterval(() => {
			if (Date.now() - lastKeyTimeRef.current > 12000) {
				startTime.current = null
				setWpm(0)
			}
		}, 1000)
		
		return () => {
			clearInterval(interval)
			clearInterval(resetInterval)
		}
	}, [])
	useEffect(() => {
		setCurrentLetter(currentText[0][0])
	}, [currentText])
	
	return (
		<section
			className="text-display"
		>
			{currentText.map((word, index) => (
				<span className={`text-display__word ${currentWordIndex === index ? 'active' : ''}`}
				      key={index}
				>{word.split('').map((letter, letterIndex) => (
					<span className={`text-display__letter text-display__letter--${index === currentWordIndex ? (statusArray[letterIndex] ?? 'pending') : 'pending'} ${letterIndex === cursorIndex && index === currentWordIndex ? 'text-display__letter--cursor' : ''}`} key={letterIndex}>{letter}</span>
				))} </span>
			))}
		</section>
	)
}

export default TextDisplay