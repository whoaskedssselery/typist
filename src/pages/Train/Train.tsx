import { useEffect } from 'react'
import useActiveStore from '@/hooks/useActiveStore.ts'
import { useSettingsStore } from '@/store/useSettingsStore.ts'
import TextDisplay from '@/components/TextDisplay'
import Keyboard from '@/components/Keyboard'
import TrainInfo from '@/components/TrainInfo'
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
