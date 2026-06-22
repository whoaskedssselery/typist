import { useSettingsStore } from '@/store/useSettingsStore.ts'
import { useTypistStoreRu,useTypistStoreEn } from '@/store/useTypistStore.ts'

const useActiveStore = () => {
	const { language } = useSettingsStore()
	const russianStore = useTypistStoreRu()
	const englishStore = useTypistStoreEn()
	return language === 'ru' ? russianStore : englishStore
}

export default useActiveStore