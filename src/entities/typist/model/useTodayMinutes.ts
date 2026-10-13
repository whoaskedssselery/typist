import { useLiveQuery } from 'dexie-react-hooks'
import { activeMsSince } from '@/entities/typist/api/sessionsRepo'

const startOfToday = () => {
	const date = new Date()
	date.setHours(0, 0, 0, 0)
	return date.getTime()
}

export const useTodayMinutes = () =>
	useLiveQuery(async () => Math.round((await activeMsSince(startOfToday())) / 6000) / 10, [], 0)
