import './Train.scss'
import TextDisplay from '@/components/TextDisplay'
import {useEffect} from 'react'
import {useTypistStore} from '@/store/useTypistStore.ts'

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
		</div>
	)
}

export default Train