import { buildExport, type ImportError, parseImport } from '@/entities/typist/model/progressFile'
import type { PersistedTypist, TypistState } from '@/entities/typist/model/types'
import { useTypistStoreEn, useTypistStoreRu } from '@/entities/typist/model/useTypistStore'

type Language = 'ru' | 'en'

const stores = { ru: useTypistStoreRu, en: useTypistStoreEn }

const toPersisted = (state: TypistState): PersistedTypist => ({
	progress: state.progress,
	wpmList: state.wpmList,
	wpmMax: state.wpmMax,
	sessionCounter: state.sessionCounter,
})

export const exportProgress = () =>
	buildExport(
		{ ru: toPersisted(stores.ru.getState()), en: toPersisted(stores.en.getState()) },
		new Date(),
	)

export const importProgress = (
	text: string,
): { ok: true; languages: Language[] } | { ok: false; error: ImportError } => {
	const result = parseImport(text)
	if (!result.ok) return result

	const applied: Language[] = []
	for (const language of ['ru', 'en'] as const) {
		const data = result.languages[language]
		if (!data) continue
		stores[language].getState().importData(data)
		applied.push(language)
	}
	return { ok: true, languages: applied }
}
