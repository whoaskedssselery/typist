import { beforeEach, describe, expect, it } from 'vitest'
import { migrateSettings, useSettingsStore } from './useSettingsStore'

beforeEach(() => {
	useSettingsStore.setState({
		uiLanguage: 'ru',
		trainingLanguage: 'ru',
		theme: 'light',
		dailyGoal: 30,
	})
})

describe('language settings', () => {
	it('sets the interface language and the training language independently', () => {
		useSettingsStore.getState().setUiLanguage('en')

		expect(useSettingsStore.getState().uiLanguage).toBe('en')
		expect(useSettingsStore.getState().trainingLanguage).toBe('ru')

		useSettingsStore.getState().setTrainingLanguage('en')
		useSettingsStore.getState().setUiLanguage('ru')

		expect(useSettingsStore.getState().trainingLanguage).toBe('en')
		expect(useSettingsStore.getState().uiLanguage).toBe('ru')
	})
})

describe('migrateSettings', () => {
	it('turns the old single language into the training language and keeps a Russian interface', () => {
		const result = migrateSettings({ language: 'en', theme: 'dark', dailyGoal: 45 }, 0)

		expect(result.trainingLanguage).toBe('en')
		expect(result.uiLanguage).toBe('ru')
		expect(result.theme).toBe('dark')
		expect(result.dailyGoal).toBe(45)
	})

	it('drops the removed daily counters', () => {
		const result = migrateSettings({ language: 'ru', todayMinutes: 12, lastSessionDate: 'x' }, 0)

		expect(result).not.toHaveProperty('todayMinutes')
		expect(result).not.toHaveProperty('lastSessionDate')
		expect(result).not.toHaveProperty('language')
	})

	it('falls back to Russian for an unknown old language', () => {
		expect(migrateSettings({ language: 'de' }, 0).trainingLanguage).toBe('ru')
	})

	it('leaves current data untouched', () => {
		const current = { uiLanguage: 'en', trainingLanguage: 'ru', theme: 'dark' }

		expect(migrateSettings(current, 1)).toEqual(current)
	})
})
