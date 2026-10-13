import Dexie, { type Table } from 'dexie'
import type { LetterSummary } from '@/entities/typist/core'
import type { Language } from '@/shared/store/settings.types'

export type SessionRecord = {
	id?: number
	language: Language
	finishedAt: number
	durationMs: number
	wpm: number
	accuracy: number
	correct: number
	errors: number
	letters: Record<string, LetterSummary>
}

class TypistDatabase extends Dexie {
	sessions!: Table<SessionRecord, number>

	constructor() {
		super('typist')
		this.version(1).stores({ sessions: '++id, language, finishedAt' })
	}
}

export const db = new TypistDatabase()
