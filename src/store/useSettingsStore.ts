import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SettingsStore } from '@/types/settings.ts'
import toast from 'react-hot-toast'

export const useSettingsStore = create<SettingsStore>()(
	persist((set) => ({
		theme: 'light',
		language: 'ru',
		fontSize: 'M',
		textFontFamily: 'JetBrains Mono',
		dailyGoal: 30,
		todayMinutes: 0,
		lastSessionDate: null,
		toggleTheme: () => set((state) => ({ theme:  state.theme === 'light' ? 'dark' : 'light' })),
		toggleLanguage: () => set((state) => ({ language: state.language === 'ru' ? 'en' : 'ru' })),
		setFontSize: (newFontSize) => set(() => {
			toast.success(`Вы успешно поменяли размер текста на ${newFontSize}`)
			return {
				fontSize: newFontSize
			}
		}),
		setFontFamily: (newFontFamily) => {
			set(() => {
				document.documentElement.style.setProperty('--font-text', newFontFamily)
				toast.success(`Вы успешно поменяли шрифт на ${newFontFamily}`)
				return { textFontFamily: newFontFamily }
			})
		},
		addMinute: () => set((state) => {
				const today = new Date().toDateString()
				const last = state.lastSessionDate?.toDateString()
				
				return {
					todayMinutes: last !== today ? 1 : state.todayMinutes + 1,
					lastSessionDate: new Date(),
				}
			}),
		setDailyGoal: (dailyGoal: number) => set(() => ({ dailyGoal })),
		resetDailyGoal: () => set(() => ({
			todayMinutes: 0,
		})),
			resetSettings: () => set(() => ({
				dailyGoal: 30,
				todayMinutes: 0,
				lastSessionDate: null,
			}))
	}),
		{
			name: 'typist-settings',
			partialize: (state) => ({
				theme: state.theme,
				dailyGoal: state.dailyGoal,
				todayMinutes: state.todayMinutes,
				lastSessionDate: state.lastSessionDate,
				fontSize: state.fontSize,
				textFontFamily: state.textFontFamily,
			})
		})
)