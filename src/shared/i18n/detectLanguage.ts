import type { Language } from '@/shared/store/settings.types'

export const detectLanguage = (): Language =>
	typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('ru')
		? 'ru'
		: 'en'
