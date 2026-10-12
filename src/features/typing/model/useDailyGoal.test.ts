import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getActiveStore } from '@/entities/typist/model/useActiveStore'
import { useSettingsStore } from '@/shared/store/useSettingsStore'
import { useDailyGoal } from './useDailyGoal'

const MINUTE = 60_000

beforeEach(() => {
	vi.useFakeTimers()
	useSettingsStore.setState({ todayMinutes: 0, lastSessionDate: null, language: 'ru' })
	getActiveStore().setState({ lastKeyAt: null })
})

afterEach(() => vi.useRealTimers())

describe('useDailyGoal', () => {
	it('adds a minute when the user typed during the last minute', () => {
		renderHook(() => useDailyGoal())
		vi.advanceTimersByTime(MINUTE / 2)
		getActiveStore().setState({ lastKeyAt: performance.now() })
		vi.advanceTimersByTime(MINUTE / 2)

		expect(useSettingsStore.getState().todayMinutes).toBe(1)
	})

	it('does not count a minute without typing', () => {
		renderHook(() => useDailyGoal())

		vi.advanceTimersByTime(MINUTE * 3)

		expect(useSettingsStore.getState().todayMinutes).toBe(0)
	})

	it('resets minutes carried over from a previous day', () => {
		const yesterday = new Date(Date.now() - 24 * 60 * MINUTE).toISOString()
		useSettingsStore.setState({ todayMinutes: 25, lastSessionDate: yesterday })

		renderHook(() => useDailyGoal())

		expect(useSettingsStore.getState().todayMinutes).toBe(0)
	})
})
