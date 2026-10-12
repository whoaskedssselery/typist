import { useEffect } from 'react'
import { useActiveStore } from '@/entities/typist/model/useActiveStore'
import { useSettingsStore } from '@/shared/store/useSettingsStore'
import Keyboard from '@/widgets/Keyboard'
import TextDisplay from '@/widgets/TextDisplay'
import TrainInfo from '@/widgets/TrainInfo'
import './Train.scss'

const Train = () => {
	const language = useSettingsStore((state) => state.language)
	const start = useActiveStore((state) => state.start)

	useEffect(() => {
		start()
	}, [start])

	return (
		<div className="train">
			<TrainInfo />
			<TextDisplay key={language} />
			<Keyboard />
		</div>
	)
}

export default Train
