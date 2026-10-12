import { useEffect } from 'react'
import { getActiveStore } from '@/entities/typist/model/useActiveStore'
import { useSettingsStore } from '@/shared/store/useSettingsStore'

const MINUTE_MS = 60_000

export const useDailyGoal = () => {
	useEffect(() => {
		const { lastSessionDate, resetDailyGoal } = useSettingsStore.getState()
		const today = new Date().toDateString()
		if (lastSessionDate && new Date(lastSessionDate).toDateString() !== today) resetDailyGoal()
	}, [])

	useEffect(() => {
		const interval = setInterval(() => {
			const lastKeyAt = getActiveStore().getState().lastKeyAt
			if (lastKeyAt !== null && performance.now() - lastKeyAt < MINUTE_MS) {
				useSettingsStore.getState().addMinute()
			}
		}, MINUTE_MS)
		return () => clearInterval(interval)
	}, [])
}
