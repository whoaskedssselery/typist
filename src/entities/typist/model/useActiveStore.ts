import { useSettingsStore } from '@/shared/store/useSettingsStore'
import type { TypistState } from './types'
import { useTypistStoreEn, useTypistStoreRu } from './useTypistStore'

export const useActiveStore = <T>(selector: (state: TypistState) => T): T => {
	const language = useSettingsStore((state) => state.trainingLanguage)
	const russian = useTypistStoreRu(selector)
	const english = useTypistStoreEn(selector)
	return language === 'ru' ? russian : english
}

export const getActiveStore = () =>
	useSettingsStore.getState().trainingLanguage === 'ru' ? useTypistStoreRu : useTypistStoreEn
