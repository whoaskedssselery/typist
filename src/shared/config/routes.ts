import type { TranslationKey } from '@/shared/i18n/translate'

export interface Route {
	key: TranslationKey<'nav'>
	path: string
}

export const routes: Route[] = [
	{ key: 'train', path: '/' },
	{ key: 'stats', path: '/stats' },
	{ key: 'settings', path: '/settings' },
]
