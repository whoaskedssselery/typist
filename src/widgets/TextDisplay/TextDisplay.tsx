import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { languages } from '@/entities/typist/config/languages'
import { getActiveStore, useActiveStore } from '@/entities/typist/model/useActiveStore'
import { useTypingInput } from '@/features/typing/model/useTypingInput'
import useDraggable from '@/shared/lib/useDraggable'
import { useSettingsStore } from '@/shared/store/useSettingsStore'
import './TextDisplay.scss'

const LAYOUT_HINT = {
	ru: 'Переключите раскладку на русскую',
	en: 'Переключите раскладку на английскую',
}

const TextDisplay = () => {
	const language = useSettingsStore((state) => state.language)
	const session = useActiveStore((state) => state.session)
	const newlyUnlockedLetter = useActiveStore((state) => state.newlyUnlockedLetter)
	const clearUnlocked = useActiveStore((state) => state.clearUnlocked)

	const ref = useRef<HTMLElement>(null)
	const { position, onMouseDown, readyToDrag } = useDraggable(ref)

	useTypingInput({
		alphabet: languages[language].order,
		press: (key, now) => getActiveStore().getState().press(key, now),
		restart: () => getActiveStore().getState().restart(),
		onForeignLayout: () => toast.error(LAYOUT_HINT[language], { id: 'layout-hint' }),
	})

	useEffect(() => {
		if (newlyUnlockedLetter) {
			toast.success(`Открыта буква ${newlyUnlockedLetter.toUpperCase()}!`)
			clearUnlocked()
		}
	}, [newlyUnlockedLetter, clearUnlocked])

	return (
		<section
			className="text-display"
			ref={ref}
			onMouseDown={onMouseDown}
			style={readyToDrag ? { position: 'fixed', left: position.x, top: position.y, margin: 0 } : {}}
		>
			{session.words.map((word, wordIndex) => {
				const isActive = wordIndex === session.wordIndex
				const isDone = wordIndex < session.wordIndex
				return (
					<span
						className={`text-display__word ${isActive ? 'active' : ''}`}
						// biome-ignore lint/suspicious/noArrayIndexKey: words are positional and may repeat
						key={`${wordIndex}-${word}`}
					>
						{[...word].map((letter, letterIndex) => {
							const isCursor = isActive && letterIndex === session.charIndex
							const status =
								isDone || (isActive && letterIndex < session.charIndex)
									? 'correct'
									: isCursor && session.cursorErrored
										? 'incorrect'
										: 'pending'
							return (
								<span
									className={`text-display__letter text-display__letter--${status} ${isCursor ? 'text-display__letter--cursor' : ''}`}
									// biome-ignore lint/suspicious/noArrayIndexKey: letters are positional and may repeat
									key={`${letterIndex}-${letter}`}
								>
									{letter}
								</span>
							)
						})}{' '}
					</span>
				)
			})}
		</section>
	)
}

export default TextDisplay
