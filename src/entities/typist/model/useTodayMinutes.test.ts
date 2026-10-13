import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/entities/typist/api/db'
import { saveSession } from '@/entities/typist/api/sessionsRepo'
import { useTodayMinutes } from './useTodayMinutes'

const record = (finishedAt: number, durationMs: number) => ({
	language: 'ru' as const,
	finishedAt,
	durationMs,
	wpm: 30,
	accuracy: 1,
	correct: 10,
	errors: 0,
	letters: {},
})

const DAY = 24 * 60 * 60 * 1000

beforeEach(async () => {
	await db.sessions.clear()
})

describe('useTodayMinutes', () => {
	it('starts at zero', async () => {
		const { result } = renderHook(() => useTodayMinutes())

		await waitFor(() => expect(result.current).toBe(0))
	})

	it('counts the typing time of today and updates when a set is saved', async () => {
		const { result } = renderHook(() => useTodayMinutes())

		await saveSession(record(Date.now(), 120_000))

		await waitFor(() => expect(result.current).toBe(2))
	})

	it('ignores sessions from earlier days', async () => {
		await saveSession(record(Date.now() - 2 * DAY, 600_000))
		const { result } = renderHook(() => useTodayMinutes())

		await saveSession(record(Date.now(), 60_000))

		await waitFor(() => expect(result.current).toBe(1))
	})
})
