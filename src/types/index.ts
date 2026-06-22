export interface Route {
	label: string;
	path: string;
}

export type Status = 'correct' | 'incorrect'
export type Theme = 'light' | 'dark'
export type Language = 'ru' | 'en'
export type FontSize = 'S' | 'M' | 'L'
export type FontFamily = 'JetBrains Mono' | 'Fira Code' | 'IBM Plex Mono' | 'Montserrat Alternates'