import { useTypistStoreEn, useTypistStoreRu } from '@/entities/typist/model/useTypistStore'
import { useSettingsStore } from '@/shared/store/useSettingsStore'

const useActiveStore = () => {
	const { language } = useSettingsStore()
	const russianStore = useTypistStoreRu()
	const englishStore = useTypistStoreEn()
	return language === 'ru' ? russianStore : englishStore
}

export default useActiveStore
