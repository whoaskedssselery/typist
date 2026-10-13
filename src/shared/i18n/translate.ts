import type { Language } from '@/shared/store/settings.types'
import { dictionary } from './dictionary'

export type Namespace = keyof typeof dictionary
export type TranslationKey<N extends Namespace> = keyof (typeof dictionary)[N]
export type Params = Record<string, string | number>

export const translate = <N extends Namespace>(
	language: Language,
	namespace: N,
	key: TranslationKey<N>,
	params?: Params,
): string => {
	const entry = dictionary[namespace][key] as Record<Language, string>
	const text = entry[language]
	if (!params) return text
	return text.replace(/\{(\w+)\}/g, (match, name: string) =>
		name in params ? String(params[name]) : match,
	)
}
