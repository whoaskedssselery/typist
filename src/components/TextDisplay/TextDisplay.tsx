import useActiveStore from '@/hooks/useActiveStore.ts'
import { useEffect, useRef, useState } from 'react'
import { useSettingsStore } from '@/store/useSettingsStore.ts'
import useDraggable from '@/hooks/useDraggable.ts'
import toast from 'react-hot-toast'
import './TextDisplay.scss'

const TextDisplay = () => {
	const [cursorIndex, setCursorIndex] = useState<number>(0)

	const { addMinute, lastSessionDate, resetDailyGoal } = useSettingsStore()

	const ref = useRef<HTMLElement>(null)
	const { position, onMouseDown, readyToDrag } = useDraggable(ref)

	const {
		currentText,
		currentWordIndex,
		nextWord,
		generateWords,
		statusArray,
		setStatusByIndex,
		resetStatus,
		setCurrentLetter,
		setIncorrectLetter,
		correctChars,
		setWpm,
		newlyUnlockedLetter,
		clearUnlockedNotification,
	} = useActiveStore()

	const letterIndexRef = useRef(0)
	const startTime = useRef<number | null>(null)
	const correctCharsRef = useRef<number>(0)
	const lastKeyTimeRef = useRef<number>(Date.now())
	const wpmRef = useRef<number>(0)

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === ' ') event.preventDefault()

		if (event.key === ' ' || event.key.length === 1) {
			if (!startTime.current) startTime.current = Date.now()
			lastKeyTimeRef.current = Date.now()

			if (
				currentText.length === currentWordIndex + 1 &&
				currentText[currentWordIndex].length - 1 === letterIndexRef.current
			) {
				generateWords()
				setCursorIndex(0)
				letterIndexRef.current = 0
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
				setCursorIndex((prev) => prev + 1)

				if (letterIndexRef.current === currentText[currentWordIndex].length) {
					setCurrentLetter(' ')
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
		const wpmInterval = setInterval(() => {
			if (startTime.current) {
				const wpm = Math.round(
					correctCharsRef.current / 5 / ((Date.now() - startTime.current) / 60000),
				)
				setWpm(wpm)
				wpmRef.current = wpm
			}
		}, 2000)

		const idleInterval = setInterval(() => {
			if (Date.now() - lastKeyTimeRef.current > 20000) {
				startTime.current = null
				setWpm(0)
				wpmRef.current = 0
			}
		}, 1000)

		return () => {
			clearInterval(wpmInterval)
			clearInterval(idleInterval)
		}
	}, [])

	useEffect(() => {
		if (currentText.length > 0) {
			setCurrentLetter(currentText[0][0])
		}
	}, [currentText])

	useEffect(() => {
		const interval = setInterval(() => {
			if (Date.now() - lastKeyTimeRef.current < 60000) {
				addMinute()
			}
		}, 60000)

		return () => {
			clearInterval(interval)
		}
	}, [])

	useEffect(() => {
		const today = new Date().toDateString()
		const last = lastSessionDate ? new Date(lastSessionDate).toDateString() : null
		if (last && last !== today) {
			resetDailyGoal()
		}
	}, [])

	useEffect(() => {
		if (newlyUnlockedLetter) {
			toast.success(`Открыта буква ${newlyUnlockedLetter.toUpperCase()}!`)
			clearUnlockedNotification()
		}
	}, [newlyUnlockedLetter])

	return (
		<section
			className="text-display"
			ref={ref}
			onMouseDown={onMouseDown}
			style={readyToDrag ? { position: 'fixed', left: position.x, top: position.y, margin: 0 } : {}}
		>
			{currentText.map((word, index) => (
				<span
					className={`text-display__word ${currentWordIndex === index ? 'active' : ''}`}
					key={index}
				>
					{word.split('').map((letter, letterIndex) => (
						<span
							className={`text-display__letter text-display__letter--${index === currentWordIndex ? (statusArray[letterIndex] ?? 'pending') : 'pending'} ${letterIndex === cursorIndex && index === currentWordIndex ? 'text-display__letter--cursor' : ''}`}
							key={letterIndex}
						>
							{letter}
						</span>
					))}{' '}
				</span>
			))}
		</section>
	)
}

export default TextDisplay
