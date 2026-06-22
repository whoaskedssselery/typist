import { useEffect } from 'react'
import useActiveStore from '@/hooks/useActiveStore.ts'
import TextDisplay from '@/components/TextDisplay'
import Keyboard from '@/components/Keyboard'
import TrainInfo from '@/components/TrainInfo'
import './Train.scss'

const Train = () => {
	const { currentText, generateWords } = useActiveStore()
	
	useEffect(() => {
		if (currentText.length === 0) {
			generateWords()
		}
	}, [])
	
	return (
		<div
			className="train"
		>
			<TrainInfo />
			<TextDisplay />
			<Keyboard />
		</div>
	)
}

export default Train