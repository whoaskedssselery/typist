import './Keyboard.scss'
import { keyboardRows } from '@/constants/keyboard.ts'
import { useTypistStore } from '@/store/useTypistStore.ts'

const Keyboard = () => {
	const { currentLetter, incorrectLetter } = useTypistStore()
	
	return (
		<section
			className="keyboard"
		>
			{keyboardRows.map((row, rowIndex) => (
				<div className="keyboard__row" key={rowIndex}>
					{row.map((cell, cellIndex) => (
						<div className={`keyboard__cell ${currentLetter === cell ? `keyboard__cell--active` : ''} ${incorrectLetter === cell ? `keyboard__cell--incorrect` : ''}`} key={cellIndex}>{cell}</div>
					))}
				</div>
			))}
			<div className={`keyboard__space ${currentLetter === " " ? `keyboard__space--active` : ''} ${incorrectLetter === " " ? `keyboard__space--incorrect` : ''}`}></div>
		</section>
	)
}

export default Keyboard