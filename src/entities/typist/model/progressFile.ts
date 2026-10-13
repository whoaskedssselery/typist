import { z } from 'zod'
import type { PersistedTypist } from './types'

export const MAX_IMPORT_BYTES = 1_000_000
const FILE_FORMAT = 'typist-progress'
const FILE_VERSION = 1

const letterStatsSchema = z.object({
	hits: z.number().int().nonnegative(),
	misses: z.number().int().nonnegative(),
	avgMs: z.number().finite().nonnegative().nullable(),
	recent: z.array(z.boolean()).max(200),
})

export const persistedSchema = z.object({
	progress: z.object({
		unlocked: z.array(z.string().min(1)).min(1).max(100),
		stats: z.record(z.string(), letterStatsSchema),
	}),
	wpmList: z.array(z.number().finite().nonnegative()).max(100_000),
	wpmMax: z.number().finite().nonnegative(),
	sessionCounter: z.number().int().nonnegative(),
})

const languagesSchema = z
	.object({ ru: persistedSchema.optional(), en: persistedSchema.optional() })
	.refine((languages) => languages.ru !== undefined || languages.en !== undefined)

const envelopeSchema = z.object({
	format: z.literal(FILE_FORMAT),
	version: z.number().int(),
})

export type LanguageData = { ru?: PersistedTypist; en?: PersistedTypist }

export type ImportError = 'too-large' | 'invalid-json' | 'invalid-format' | 'unsupported-version'

export type ImportResult = { ok: true; languages: LanguageData } | { ok: false; error: ImportError }

export const parsePersisted = (
	value: unknown,
): { ok: true; data: PersistedTypist } | { ok: false } => {
	const result = persistedSchema.safeParse(value)
	return result.success ? { ok: true, data: result.data } : { ok: false }
}

export const buildExport = (languages: LanguageData, now: Date) =>
	JSON.stringify(
		{ format: FILE_FORMAT, version: FILE_VERSION, exportedAt: now.toISOString(), languages },
		null,
		2,
	)

export const parseImport = (text: string): ImportResult => {
	if (text.length > MAX_IMPORT_BYTES) return { ok: false, error: 'too-large' }

	let raw: unknown
	try {
		raw = JSON.parse(text)
	} catch {
		return { ok: false, error: 'invalid-json' }
	}

	const envelope = envelopeSchema.safeParse(raw)
	if (!envelope.success) return { ok: false, error: 'invalid-format' }
	if (envelope.data.version > FILE_VERSION) return { ok: false, error: 'unsupported-version' }

	const languages = languagesSchema.safeParse((raw as { languages?: unknown }).languages)
	if (!languages.success) return { ok: false, error: 'invalid-format' }

	return { ok: true, languages: languages.data }
}
