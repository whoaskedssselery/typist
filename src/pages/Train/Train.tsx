import { useEffect } from 'react'
import useActiveStore from '@/entities/typist/model/useActiveStore'
import { useSettingsStore } from '@/shared/store/useSettingsStore'
import TextDisplay from '@/widgets/TextDisplay'
import Keyboard from '@/widgets/Keyboard'
import TrainInfo from '@/widgets/TrainInfo'
import './Train.scss'

const Train = () => {
	const { language } = useSettingsStore()
	const { currentText, generateWords } = useActiveStore()

	useEffect(() => {
		if (currentText.length === 0) {
			generateWords()
		}
	}, [language])

	return (
		<div className="train">
			<TrainInfo />
			<TextDisplay key={language} />
			<Keyboard />
		</div>
	)
}

export default Train
