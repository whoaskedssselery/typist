import { beforeEach, describe, expect, it } from 'vitest'
import { reportCorruption, takeCorruptionReports } from './corruption'

beforeEach(() => {
	takeCorruptionReports()
})

describe('corruption reports', () => {
	it('is empty when nothing was reported', () => {
		expect(takeCorruptionReports()).toEqual([])
	})

	it('hands out each report once', () => {
		reportCorruption('typist-store-ru')
		reportCorruption('typist-store-en')

		expect(takeCorruptionReports()).toEqual(['typist-store-ru', 'typist-store-en'])
		expect(takeCorruptionReports()).toEqual([])
	})

	it('does not repeat the same store twice', () => {
		reportCorruption('typist-store-ru')
		reportCorruption('typist-store-ru')

		expect(takeCorruptionReports()).toEqual(['typist-store-ru'])
	})
})
