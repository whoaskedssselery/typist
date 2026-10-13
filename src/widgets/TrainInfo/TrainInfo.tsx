import './TrainInfo.scss'
import { selectAccuracyPercent, selectWpm } from '@/entities/typist/model/selectors'
import { useActiveStore } from '@/entities/typist/model/useActiveStore'
import { useTodayMinutes } from '@/entities/typist/model/useTodayMinutes'
import LetterProgress from '@/entities/typist/ui/LetterProgress'
import { useT } from '@/shared/i18n/useT'
import { useSettingsStore } from '@/shared/store/useSettingsStore'

const TrainInfo = () => {
	const dailyGoal = useSettingsStore((state) => state.dailyGoal)
	const todayMinutes = useTodayMinutes()
	const t = useT('train')
	const wpm = useActiveStore(selectWpm)
	const accuracy = useActiveStore(selectAccuracyPercent)

	return (
		<section className="train-info">
			<div className="train-info__row">
				<span className="train-info__label">{t('metrics')}:</span>
				<div className="train-info__content">
					<span className="train-info__metric-title">{t('speed')}:</span>
					<span className="train-info__metric-value">
						{wpm} {t('wpm')}
					</span>
					<div className="train-info__divider" />
					<span className="train-info__metric-title">{t('accuracy')}:</span>
					<span className="train-info__metric-value">{accuracy}%</span>
				</div>
			</div>
			<div className="train-info__row">
				<span className="train-info__label">{t('allLetters')}:</span>
				<LetterProgress />
			</div>
			<div className="train-info__row">
				<span className="train-info__label">{t('dailyGoal')}:</span>
				<div className="train-info__content">
					<span className="train-info__metric-title">
						{todayMinutes}/{dailyGoal} {t('minutesShort')}
					</span>
					<div className="train-info__progress">
						<div
							className="train-info__progress-bar"
							style={{ width: `${Math.min((todayMinutes / dailyGoal) * 100, 100)}%` }}
						/>
					</div>
				</div>
			</div>
		</section>
	)
}

export default TrainInfo
