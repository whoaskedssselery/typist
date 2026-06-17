import './Train.scss'
import TextDisplay from '@/components/TextDisplay'
import {useEffect} from 'react'
import {useTypistStore} from '@/store/useTypistStore.ts'
import Keyboard from '@/components/Keyboard'

const Train = () => {
	const { generateWords } = useTypistStore()
	
	useEffect(() => {
		generateWords()
	}, [])
	
	return (
		<div
			className="train"
		>
			<TextDisplay />
			<Keyboard />
		</div>
	)
}

export default Train