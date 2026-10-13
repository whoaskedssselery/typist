export type Theme = 'light' | 'dark'
export type Language = 'ru' | 'en'
export type FontSize = 'S' | 'M' | 'L'
export type FontFamily = 'JetBrains Mono' | 'Fira Code' | 'IBM Plex Mono' | 'Montserrat Alternates'

export type SettingsStore = {
	theme: Theme
	uiLanguage: Language
	trainingLanguage: Language
	fontSize: FontSize
	textFontFamily: FontFamily
	dailyGoal: number
	toggleTheme: () => void
	setUiLanguage: (language: Language) => void
	setTrainingLanguage: (language: Language) => void
	setFontSize: (fontSize: FontSize) => void
	setFontFamily: (fontFamily: FontFamily) => void
	setDailyGoal: (dailyGoal: number) => void
	resetSettings: () => void
}
