import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { useActiveStore } from '@/entities/typist/model/useActiveStore'
import { useTodayMinutes } from '@/entities/typist/model/useTodayMinutes'
import LetterProgress from '@/entities/typist/ui/LetterProgress'
import './Stats.scss'
import { useT } from '@/shared/i18n/useT'
import { useSettingsStore } from '@/shared/store/useSettingsStore'

type WpmTooltipProps = {
	active?: boolean
	payload?: Array<{ value: number }>
}

const CustomTooltip = ({ active, payload }: WpmTooltipProps) => {
	if (active && payload?.length) {
		return (
			<div className="stats__tooltip">
				<span>{payload[0].value} wpm</span>
			</div>
		)
	}
	return null
}

const Stats = () => {
	const t = useT('stats')
	const dailyGoal = useSettingsStore((state) => state.dailyGoal)
	const todayMinutes = useTodayMinutes()
	const wpmList = useActiveStore((state) => state.wpmList)
	const wpmMax = useActiveStore((state) => state.wpmMax)
	const sessionCounter = useActiveStore((state) => state.sessionCounter)

	const data = wpmList.map((wpm, index) => ({ session: index + 1, wpm }))

	return (
		<section className="stats">
			<div className="stats__wrapper">
				<span className="stats__wpm-best">{wpmMax} wpm</span>
				<span className="stats__session-counter">{sessionCounter}</span>
				<span className="stats__daily-progress">
					{todayMinutes}/{dailyGoal} {t('minutes')}
				</span>
			</div>
			<div className="stats__chart">
				<LineChart
					style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }}
					data={data}
					margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
				>
					<CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
					<Line type="monotone" dataKey="wpm" stroke="purple" strokeWidth={2} name="wpm" />
					<XAxis
						dataKey="session"
						label={{ value: t('session'), position: 'insideBottom', offset: -5 }}
					/>
					<YAxis dataKey="wpm" label={{ value: 'wpm', position: 'insideLeft', angle: -90 }} />
					<Tooltip content={<CustomTooltip />} />
				</LineChart>
			</div>
			<div className="stats__letter-progress">
				<LetterProgress />
			</div>
		</section>
	)
}

export default Stats
