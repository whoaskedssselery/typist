import { englishKeyboardRows } from '@/entities/typist/config/english/englishKeyboard.ts'
import { russianKeyboardRows } from '@/entities/typist/config/russian/russianKeyboard.ts'
import { expectedChar } from '@/entities/typist/core'
import { useActiveStore } from '@/entities/typist/model/useActiveStore'
import useDraggable from '@/shared/lib/useDraggable'
import { useSettingsStore } from '@/shared/store/useSettingsStore'
import './Keyboard.scss'
import { useRef } from 'react'

const Keyboard = () => {
	const language = useSettingsStore((state) => state.language)
	const currentLetter = useActiveStore((state) => expectedChar(state.session))
	const incorrectLetter = useActiveStore((state) => state.incorrectLetter)

	const ref = useRef<HTMLElement>(null)

	const { position, onMouseDown, readyToDrag } = useDraggable(ref)

	const keyboardRows = language === 'ru' ? russianKeyboardRows : englishKeyboardRows

	return (
		<section
			className="keyboard"
			ref={ref}
			onMouseDown={onMouseDown}
			style={readyToDrag ? { position: 'fixed', top: position.y, left: position.x, margin: 0 } : {}}
		>
			{keyboardRows.map((row) => (
				<div className="keyboard__row" key={row.join('')}>
					{row.map((cell) => (
						<div
							className={`keyboard__cell ${currentLetter === cell ? `keyboard__cell--active` : ''} ${incorrectLetter === cell ? `keyboard__cell--incorrect` : ''}`}
							key={cell}
						>
							{cell}
						</div>
					))}
				</div>
			))}
			<div
				className={`keyboard__space ${currentLetter === ' ' ? `keyboard__space--active` : ''} ${incorrectLetter === ' ' ? `keyboard__space--incorrect` : ''}`}
			></div>
		</section>
	)
}

export default Keyboard
