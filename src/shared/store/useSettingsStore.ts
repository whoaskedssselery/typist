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
			toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
			toggleLanguage: () => set((state) => ({ language: state.language === 'ru' ? 'en' : 'ru' })),
			setFontSize: (fontSize) => set(() => ({ fontSize })),
			setFontFamily: (textFontFamily) => set(() => ({ textFontFamily })),
			setDailyGoal: (dailyGoal) => set(() => ({ dailyGoal })),
			resetSettings: () => set(() => ({ dailyGoal: 30 })),
		}),
		{
			name: 'typist-settings',
			partialize: (state) => ({
				theme: state.theme,
				language: state.language,
				dailyGoal: state.dailyGoal,
				fontSize: state.fontSize,
				textFontFamily: state.textFontFamily,
			}),
		},
	),
)
