import type { Theme, Language, FontSize, FontFamily } from '@/types/index.ts'

export type SettingsStore = {
	theme: Theme
	language: Language
	fontSize: FontSize
	textFontFamily: FontFamily
	dailyGoal: number
	todayMinutes: number
	lastSessionDate: string | null
	toggleTheme: () => void
	toggleLanguage: () => void
	setFontSize: (fontSize: FontSize) => void
	setFontFamily: (fontFamily: FontFamily) => void
	addMinute: () => void
	setDailyGoal: (dailyGoal: number) => void
	resetDailyGoal: () => void
	resetSettings: () => void
}
