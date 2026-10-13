import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { detectLanguage } from '@/shared/i18n/detectLanguage'
import type { Language, SettingsStore } from '@/shared/store/settings.types'

const isLanguage = (value: unknown): value is Language => value === 'ru' || value === 'en'

export const migrateSettings = (persisted: unknown, version: number): Record<string, unknown> => {
	if (version >= 1) return persisted as Record<string, unknown>

	const {
		language,
		todayMinutes: _minutes,
		lastSessionDate: _date,
		...rest
	} = (persisted ?? {}) as Record<string, unknown>
	return {
		...rest,
		trainingLanguage: isLanguage(language) ? language : 'ru',
		uiLanguage: 'ru',
	}
}

export const useSettingsStore = create<SettingsStore>()(
	persist(
		(set) => ({
			theme: 'light',
			uiLanguage: detectLanguage(),
			trainingLanguage: detectLanguage(),
			fontSize: 'M',
			textFontFamily: 'JetBrains Mono',
			dailyGoal: 30,
			toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
			setUiLanguage: (uiLanguage) => set({ uiLanguage }),
			setTrainingLanguage: (trainingLanguage) => set({ trainingLanguage }),
			setFontSize: (fontSize) => set(() => ({ fontSize })),
			setFontFamily: (textFontFamily) => set(() => ({ textFontFamily })),
			setDailyGoal: (dailyGoal) => set(() => ({ dailyGoal })),
			resetSettings: () => set(() => ({ dailyGoal: 30 })),
		}),
		{
			name: 'typist-settings',
			version: 1,
			migrate: migrateSettings,
			partialize: (state) => ({
				theme: state.theme,
				uiLanguage: state.uiLanguage,
				trainingLanguage: state.trainingLanguage,
				dailyGoal: state.dailyGoal,
				fontSize: state.fontSize,
				textFontFamily: state.textFontFamily,
			}),
		},
	),
)
