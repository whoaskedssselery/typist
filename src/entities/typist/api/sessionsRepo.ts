import type { Language } from '@/shared/store/settings.types'
import { db, type SessionRecord } from './db'

export type { SessionRecord } from './db'

export const saveSession = async (record: SessionRecord) => {
	try {
		await db.sessions.add(record)
		return true
	} catch {
		return false
	}
}

export const listSessions = async (language: Language): Promise<SessionRecord[]> => {
	try {
		return await db.sessions.where('language').equals(language).sortBy('finishedAt')
	} catch {
		return []
	}
}

export const activeMsSince = async (from: number) => {
	try {
		let total = 0
		await db.sessions
			.where('finishedAt')
			.aboveOrEqual(from)
			.each((session) => {
				total += session.durationMs
			})
		return total
	} catch {
		return 0
	}
}

export const clearSessions = async (language: Language) => {
	try {
		await db.sessions.where('language').equals(language).delete()
	} catch {
		// history is a convenience, losing the delete is not worth failing a reset
	}
}

export const allSessions = async (): Promise<SessionRecord[]> => {
	try {
		return await db.sessions.orderBy('finishedAt').toArray()
	} catch {
		return []
	}
}

export const replaceSessions = async (language: Language, records: SessionRecord[]) => {
	try {
		await db.transaction('rw', db.sessions, async () => {
			await db.sessions.where('language').equals(language).delete()
			await db.sessions.bulkAdd(records.map(({ id: _id, ...rest }) => rest))
		})
		return true
	} catch {
		return false
	}
}
