import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { INITIAL_LETTER_COUNT, languages } from '@/entities/typist/config/languages'
import {
	createSession,
	DEFAULT_CONFIG,
	type EngineConfig,
	finishSet,
	focusLetter,
	generateSet,
	initialProgress,
	type Progress,
	type Rng,
	sessionAccuracy,
	sessionWpm,
	typeChar,
} from '@/entities/typist/core'
import type { PersistedTypist, TypistState } from './types'

type StoreOptions = {
	name: string
	order: string[]
	words: string[]
	initialCount?: number
	config?: EngineConfig
	rng?: Rng
}

const WRONG_KEY_FLASH_MS = 700

const isStringArray = (value: unknown): value is string[] =>
	Array.isArray(value) && value.every((item) => typeof item === 'string')

const isNumberArray = (value: unknown): value is number[] =>
	Array.isArray(value) && value.every((item) => typeof item === 'number')

export const migratePersisted = (
	persisted: unknown,
	version: number,
	order: string[],
	initialCount: number,
): PersistedTypist => {
	if (version >= 1) return persisted as PersistedTypist

	const legacy = (persisted ?? {}) as Record<string, unknown>
	return {
		progress: {
			unlocked: isStringArray(legacy.unlockedLetters)
				? legacy.unlockedLetters
				: order.slice(0, initialCount),
			stats: {},
		},
		wpmList: isNumberArray(legacy.wpmList) ? legacy.wpmList : [],
		wpmMax: typeof legacy.wpmMax === 'number' ? legacy.wpmMax : 0,
		sessionCounter: typeof legacy.sessionCounter === 'number' ? legacy.sessionCounter : 0,
	}
}

export const createTypistStore = ({
	name,
	order,
	words,
	initialCount = INITIAL_LETTER_COUNT,
	config = DEFAULT_CONFIG,
	rng = Math.random,
}: StoreOptions) => {
	let flashTimer: ReturnType<typeof setTimeout> | undefined

	const newSession = (progress: Progress) =>
		createSession(
			generateSet({
				words,
				unlocked: progress.unlocked,
				focus: focusLetter(progress, config),
				config,
				rng,
			}),
		)

	const freshProgress = () => initialProgress(order, initialCount)

	return create<TypistState>()(
		persist(
			(set, get) => ({
				progress: freshProgress(),
				wpmList: [],
				wpmMax: 0,
				sessionCounter: 0,
				session: createSession([]),
				lastResult: null,
				newlyUnlockedLetter: null,
				incorrectLetter: '',
				lastKeyAt: null,

				start: () => {
					if (get().session.words.length > 0) return
					set({ session: newSession(get().progress) })
				},

				restart: () => set({ session: newSession(get().progress), incorrectLetter: '' }),

				press: (key, now) => {
					const state = get()
					const next = typeChar(state.session, key, now, config)
					if (next === state.session) return

					const wrong = next.errors > state.session.errors
					if (wrong) {
						clearTimeout(flashTimer)
						flashTimer = setTimeout(() => set({ incorrectLetter: '' }), WRONG_KEY_FLASH_MS)
					}
					const incorrectLetter = wrong ? key.toLowerCase() : state.incorrectLetter

					if (next.status !== 'done') {
						set({ session: next, lastKeyAt: now, incorrectLetter })
						return
					}

					const wpm = Math.round(sessionWpm(next))
					const { progress, unlockedLetter } = finishSet(state.progress, next.events, order, config)
					set({
						progress,
						session: newSession(progress),
						sessionCounter: state.sessionCounter + 1,
						wpmList: wpm > 0 ? [...state.wpmList, wpm] : state.wpmList,
						wpmMax: Math.max(state.wpmMax, wpm),
						lastResult: { wpm, accuracy: sessionAccuracy(next) },
						newlyUnlockedLetter: unlockedLetter ?? state.newlyUnlockedLetter,
						lastKeyAt: now,
						incorrectLetter,
					})
				},

				clearUnlocked: () => set({ newlyUnlockedLetter: null }),

				reset: () => {
					const progress = freshProgress()
					set({
						progress,
						wpmList: [],
						wpmMax: 0,
						sessionCounter: 0,
						session: newSession(progress),
						lastResult: null,
						newlyUnlockedLetter: null,
						incorrectLetter: '',
						lastKeyAt: null,
					})
				},
			}),
			{
				name,
				version: 1,
				migrate: (persisted, version) => migratePersisted(persisted, version, order, initialCount),
				partialize: (state): PersistedTypist => ({
					progress: state.progress,
					wpmList: state.wpmList,
					wpmMax: state.wpmMax,
					sessionCounter: state.sessionCounter,
				}),
			},
		),
	)
}

export const useTypistStoreRu = createTypistStore({ name: 'typist-store-ru', ...languages.ru })
export const useTypistStoreEn = createTypistStore({ name: 'typist-store-en', ...languages.en })
