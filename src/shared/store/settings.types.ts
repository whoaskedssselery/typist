export type Theme = 'light' | 'dark'
export type Language = 'ru' | 'en'
export type FontSize = 'S' | 'M' | 'L'
export type FontFamily = 'JetBrains Mono' | 'Fira Code' | 'IBM Plex Mono' | 'Montserrat Alternates'


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
