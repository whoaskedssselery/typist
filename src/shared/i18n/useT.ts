import { useSettingsStore } from '@/shared/store/useSettingsStore'
import { type Namespace, type Params, type TranslationKey, translate } from './translate'

export const useT = <N extends Namespace>(namespace: N) => {
	const language = useSettingsStore((state) => state.uiLanguage)
	return (key: TranslationKey<N>, params?: Params) => translate(language, namespace, key, params)
}

export const t = <N extends Namespace>(namespace: N, key: TranslationKey<N>, params?: Params) =>
	translate(useSettingsStore.getState().uiLanguage, namespace, key, params)
