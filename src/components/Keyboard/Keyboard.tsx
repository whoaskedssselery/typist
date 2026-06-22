import './Keyboard.scss'
import { russianKeyboardRows } from '@/constants/russianStore/russianKeyboard.ts'
import { englishKeyboardRows } from '@/constants/englishStore/englishKeyboard.ts'
import useActiveStore from '@/hooks/useActiveStore.ts'
import {useSettingsStore} from '@/store/useSettingsStore.ts'

const Keyboard = () => {
	const { language } = useSettingsStore()
	const { currentLetter, incorrectLetter } = useActiveStore()
	
	const keyboardRows = language === 'ru' ? russianKeyboardRows : englishKeyboardRows
	
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