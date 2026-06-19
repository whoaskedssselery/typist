import './TrainInfo.scss'
import { useTypistStore } from '@/store/useTypistStore.ts'
import { useMemo } from 'react'
import LetterProgress from '@/components/LetterProgress'

const TrainInfo = () => {
	const {
		wpm, correctChars, incorrectChars,
		dailyGoal, todayMinutes
	} = useTypistStore()
	
	const accuracy = useMemo(() => {
		const total = correctChars + incorrectChars
		if (total === 0) return 0
		return Math.round(correctChars / total * 100)
	}, [correctChars, incorrectChars])
	
	return (
		<section className="train-info">
			<div className="train-info__row">
				<span className="train-info__label">Метрики:</span>
				<div className="train-info__content">
					<span className="train-info__metric-title">Скорость:</span>
					<span className="train-info__metric-value">{wpm} wpm</span>
					<div className="train-info__divider" />
					<span className="train-info__metric-title">Точность:</span>
					<span className="train-info__metric-value">{accuracy}%</span>
				</div>
			</div>
			<div className="train-info__row">
				<span className="train-info__label">Все буквы:</span>
				<LetterProgress />
			</div>
			<div className="train-info__row">
				<span className="train-info__label">Дневная цель:</span>
				<div className="train-info__content">
					<span className="train-info__metric-title">{todayMinutes}/{dailyGoal} мин</span>
					<div className="train-info__progress">
						<div className="train-info__progress-bar" style={{ width: `${Math.min(todayMinutes / dailyGoal * 100, 100)}%` }} />
					</div>
				</div>
			</div>
		</section>
	)
}

export default TrainInfo