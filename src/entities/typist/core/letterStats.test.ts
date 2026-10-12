import { describe, expect, it } from 'vitest'
import { DEFAULT_CONFIG } from './config'
import { accuracy, confidence, emptyStats, recordHit, recordMiss, targetMs } from './letterStats'

describe('targetMs', () => {
	it('converts target WPM to milliseconds per character', () => {
		expect(targetMs(30)).toBe(400)
		expect(targetMs(60)).toBe(200)
	})
})

describe('recordHit', () => {
	it('uses the first sample as the average', () => {
		const stats = recordHit(emptyStats(), 500, DEFAULT_CONFIG)

		expect(stats.avgMs).toBe(500)
		expect(stats.recent).toEqual([true])
	})

	it('blends later samples with the moving average', () => {
		let stats = recordHit(emptyStats(), 500, DEFAULT_CONFIG)
		stats = recordHit(stats, 300, DEFAULT_CONFIG)

		expect(stats.avgMs).toBeCloseTo(500 + (300 - 500) * DEFAULT_CONFIG.emaAlpha)
	})

	it('counts a hit without timing but leaves the average alone', () => {
		const stats = recordHit(recordHit(emptyStats(), 400, DEFAULT_CONFIG), null, DEFAULT_CONFIG)

		expect(stats.avgMs).toBe(400)
		expect(stats.hits).toBe(2)
	})

	it('does not mutate the previous stats', () => {
		const before = emptyStats()
		recordHit(before, 400, DEFAULT_CONFIG)

		expect(before).toEqual(emptyStats())
	})
})

describe('accuracy', () => {
	it('is zero before any attempt', () => {
		expect(accuracy(emptyStats())).toBe(0)
	})

	it('only looks at the most recent window of attempts', () => {
		const config = { ...DEFAULT_CONFIG, window: 4 }
		let stats = emptyStats()
		stats = recordMiss(stats, config)
		stats = recordMiss(stats, config)
		for (let i = 0; i < 4; i++) stats = recordHit(stats, 300, config)

		expect(accuracy(stats)).toBe(1)
		expect(stats.recent).toHaveLength(4)
		expect(stats.misses).toBe(2)
	})
})

describe('confidence', () => {
	it('is zero until a timed hit exists', () => {
		expect(confidence(emptyStats(), 30)).toBe(0)
	})

	it('is one when typing exactly at the target speed', () => {
		const stats = recordHit(emptyStats(), 400, DEFAULT_CONFIG)

		expect(confidence(stats, 30)).toBe(1)
	})

	it('drops below one when slower than the target', () => {
		const stats = recordHit(emptyStats(), 800, DEFAULT_CONFIG)

		expect(confidence(stats, 30)).toBe(0.5)
	})
})
