import { useSettingsStore } from '@/shared/store/useSettingsStore'
import { useTypistStoreRu,useTypistStoreEn } from '@/entities/typist/model/useTypistStore'

const useActiveStore = () => {
	const { language } = useSettingsStore()
	const russianStore = useTypistStoreRu()
	const englishStore = useTypistStoreEn()
	return language === 'ru' ? russianStore : englishStore
}

export default useActiveStore