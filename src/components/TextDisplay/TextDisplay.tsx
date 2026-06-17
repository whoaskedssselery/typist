import './TextDisplay.scss'
import { useTypistStore } from '@/store/useTypistStore.ts'
import {useEffect, useRef, useState} from 'react'
import type { Status } from '@/types'

const TextDisplay = () => {
	const { currentText, currentWordIndex,nextWord } = useTypistStore()
	
	const letterIndexRef = useRef(0)
	const statusArrayRef = useRef<Status[]>([])
	
	const handleKeyPress = (event: KeyboardEvent) => {
		console.log(
			`Клавиша: ${event.key}`,
			`Реф: ${letterIndexRef.current}`,
			currentText[currentWordIndex],
			currentText[currentWordIndex][letterIndexRef.current] ?? 'Пробел',
		)
		
		if (event.key === ' ' || event.key.length === 1) {
			if (currentText[currentWordIndex].length === letterIndexRef.current && event.key === ' ') {
				nextWord()
				statusArrayRef.current = []
				letterIndexRef.current = 0
				return
			}
			
			if (currentText[currentWordIndex][letterIndexRef.current] === event.key) {
				statusArrayRef.current[letterIndexRef.current] = 'correct'
				letterIndexRef.current = letterIndexRef.current + 1
			} else {
				statusArrayRef.current[letterIndexRef.current] = 'incorrect'
			}
		}
	}
	
	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress)
		
		return () => {
			window.removeEventListener('keydown', handleKeyPress)
		}
	}, [currentText, currentWordIndex])
	
	return (
		<div
			className="text-display"
		>
			{currentText.map((word, index) => (
				<span className={`text-display__word ${currentWordIndex === index ? 'active' : ''}`}
				      key={index}
				>{word.split('').map((letter, letterIndex) => (
					<span className={`text-display__letter text-display__letter--${index === currentWordIndex ? (statusArrayRef.current[letterIndex] ?? 'pending') : 'pending'}`} key={letterIndex}>{letter}</span>
				))} </span>
			))}
		</div>
	)
}

//

export default TextDisplay