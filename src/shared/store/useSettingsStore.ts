import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SettingsStore } from '@/shared/store/settings.types'

export const useSettingsStore = create<SettingsStore>()(
	persist(
		(set) => ({
			theme: 'light',
			language: 'ru',
			fontSize: 'M',
			textFontFamily: 'JetBrains Mono',
			dailyGoal: 30,
			todayMinutes: 0,
			lastSessionDate: null,
			toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
			toggleLanguage: () =>
				set((state) => ({ language: state.language === 'ru' ? 'en' : 'ru' })),
			setFontSize: (fontSize) => set(() => ({ fontSize })),
			setFontFamily: (textFontFamily) => set(() => ({ textFontFamily })),
			addMinute: () =>
				set((state) => {
					const today = new Date().toDateString()
					const last = state.lastSessionDate
						? new Date(state.lastSessionDate).toDateString()
						: null
					return {
						todayMinutes: last !== today ? 1 : state.todayMinutes + 1,
						lastSessionDate: new Date().toISOString(),
					}
				}),
			setDailyGoal: (dailyGoal) => set(() => ({ dailyGoal })),
			resetDailyGoal: () => set(() => ({ todayMinutes: 0 })),
			resetSettings: () =>
				set(() => ({
					dailyGoal: 30,
					todayMinutes: 0,
					lastSessionDate: null,
				})),
		}),
		{
			name: 'typist-settings',
			partialize: (state) => ({
				theme: state.theme,
				language: state.language,
				dailyGoal: state.dailyGoal,
				todayMinutes: state.todayMinutes,
				lastSessionDate: state.lastSessionDate,
				fontSize: state.fontSize,
				textFontFamily: state.textFontFamily,
			}),
		},
	),
)
