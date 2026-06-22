import { useTypistStore } from '@/store/useTypistStore.ts'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import LetterProgress from '@/components/LetterProgress'
import './Stats.scss'

const Stats = () => {
	const {
		wpmList, wpmMax, sessionCounter, todayMinutes,
		dailyGoal } = useTypistStore()
	
	const data = wpmList.map((wpm,  index) => ({ session: index + 1, wpm }))
	
	return (
		<section
			className="stats"
		>
			<div className="stats__wrapper">
				<span className="stats__wpm-best">{wpmMax} wpm</span>
				<span className="stats__session-counter"> {sessionCounter}</span>
				<span className="stats__daily-progress"> {todayMinutes}/{dailyGoal} минут</span>
			</div>
			<div className="stats__chart">
				<LineChart
					style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }}
					responsive
					data={data}
					margin={{
						top: 20,
						right: 20,
						bottom: 5,
						left: 0,
					}}
				>
					<CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
					<Line type="monotone" dataKey="wpm" stroke="purple" strokeWidth={2} name="wpm" />
					<XAxis dataKey="session" />
					<YAxis width="auto" label={{ value: 'wpm', position: 'insideLeft', angle: -90 }} />
					<Tooltip />
				</LineChart>
			</div>
			<div className="stats__letter-progress">
				<LetterProgress />
			</div>
		</section>
	)
}

export default Stats