import './Train.scss'
import TextDisplay from '@/components/TextDisplay'
import {useEffect} from 'react'
import { useTypistStore } from '@/store/useTypistStore.ts'
import Keyboard from '@/components/Keyboard'
import TrainInfo from '@/components/TrainInfo'

const Train = () => {
	const { generateWords } = useTypistStore()
	
	useEffect(() => {
		generateWords()
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