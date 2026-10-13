import { beforeEach, describe, expect, it } from 'vitest'
import { createRng, DEFAULT_CONFIG } from '@/entities/typist/core'
import { createTypistStore, migratePersisted } from './useTypistStore'

const order = ['a', 'b', 'c', 'd']
const words = ['ab', 'ba', 'aab', 'bba']
const config = { ...DEFAULT_CONFIG, setSize: 2, minSamples: 1, targetWpm: 1 }

let counter = 0
const makeStore = () =>
	createTypistStore({
		name: `test-store-${counter++}`,
		order,
		initialCount: 2,
		words,
		config,
		rng: createRng(3),
	})

const typeWord = (store: ReturnType<typeof makeStore>, text: string, startAt = 0) => {
	for (const [index, key] of [...text].entries()) store.getState().press(key, startAt + index * 100)
}

const currentText = (store: ReturnType<typeof makeStore>) =>
	store.getState().session.words.join(' ')

beforeEach(() => localStorage.clear())

describe('createTypistStore', () => {
	it('starts with no session until start() is called', () => {
		const store = makeStore()

		expect(store.getState().session.words).toEqual([])

		store.getState().start()
		expect(store.getState().session.words).toHaveLength(2)
	})

	it('keeps the existing session when start() is called twice', () => {
		const store = makeStore()
		store.getState().start()
		const first = store.getState().session

		store.getState().start()

		expect(store.getState().session).toBe(first)
	})

	it('flashes the wrong key and clears it later', async () => {
		const store = makeStore()
		store.getState().start()

		store.getState().press('z', 0)

		expect(store.getState().incorrectLetter).toBe('z')
		expect(store.getState().session.errors).toBe(1)
	})

	it('completes a set: counts the session, records WPM and starts a fresh set', () => {
		const store = makeStore()
		store.getState().start()
		const text = currentText(store)

		typeWord(store, text, 0)

		const state = store.getState()
		expect(state.sessionCounter).toBe(1)
		expect(state.wpmList).toHaveLength(1)
		expect(state.wpmMax).toBe(state.wpmList[0])
		expect(state.lastResult?.accuracy).toBe(1)
		expect(state.session.status).toBe('idle')
		expect(state.session.words).toHaveLength(2)
	})

	it('unlocks the next letter when the unlocked ones are mastered', () => {
		const store = makeStore()
		store.getState().start()

		typeWord(store, currentText(store), 0)

		expect(store.getState().progress.unlocked).toEqual(['a', 'b', 'c'])
		expect(store.getState().newlyUnlockedLetter).toBe('c')

		store.getState().clearUnlocked()
		expect(store.getState().newlyUnlockedLetter).toBeNull()
	})

	it('restarts the current set on request', () => {
		const store = makeStore()
		store.getState().start()
		store.getState().press('a', 0)

		store.getState().restart()

		expect(store.getState().session.correct).toBe(0)
		expect(store.getState().session.words).toHaveLength(2)
	})

	it('resets progress back to the initial letters', () => {
		const store = makeStore()
		store.getState().start()
		typeWord(store, currentText(store), 0)

		store.getState().reset()

		const state = store.getState()
		expect(state.progress.unlocked).toEqual(['a', 'b'])
		expect(state.sessionCounter).toBe(0)
		expect(state.wpmList).toEqual([])
		expect(state.session.words).toHaveLength(2)
	})

	it('keeps the last key time for activity tracking', () => {
		const store = makeStore()
		store.getState().start()

		store.getState().press('a', 1234)

		expect(store.getState().lastKeyAt).toBe(1234)
	})
})

describe('importData', () => {
	it('replaces progress and starts a set from the imported letters', () => {
		const store = makeStore()
		store.getState().start()

		store.getState().importData({
			progress: { unlocked: ['a', 'b', 'c'], stats: {} },
			wpmList: [40],
			wpmMax: 40,
			sessionCounter: 5,
		})

		const state = store.getState()
		expect(state.progress.unlocked).toEqual(['a', 'b', 'c'])
		expect(state.wpmList).toEqual([40])
		expect(state.sessionCounter).toBe(5)
		expect(state.session.words).toHaveLength(2)
		expect(state.session.correct).toBe(0)
	})
})

describe('corrupted storage', () => {
	it('falls back to defaults and keeps a backup of the broken data', () => {
		const name = 'test-store-corrupt'
		const broken = { state: { progress: { unlocked: [] }, wpmList: 'x' }, version: 1 }
		localStorage.setItem(name, JSON.stringify(broken))

		const store = createTypistStore({
			name,
			order,
			initialCount: 2,
			words,
			config,
			rng: createRng(3),
		})

		expect(store.getState().progress.unlocked).toEqual(['a', 'b'])
		expect(store.getState().wpmList).toEqual([])
		expect(JSON.parse(localStorage.getItem(`${name}-corrupt`) ?? 'null')).toEqual(broken.state)
	})

	it('keeps valid stored data', () => {
		const name = 'test-store-valid'
		const saved = {
			progress: { unlocked: ['a', 'b', 'c'], stats: {} },
			wpmList: [33],
			wpmMax: 33,
			sessionCounter: 4,
		}
		localStorage.setItem(name, JSON.stringify({ state: saved, version: 1 }))

		const store = createTypistStore({
			name,
			order,
			initialCount: 2,
			words,
			config,
			rng: createRng(3),
		})

		expect(store.getState().progress.unlocked).toEqual(['a', 'b', 'c'])
		expect(store.getState().sessionCounter).toBe(4)
		expect(localStorage.getItem(`${name}-corrupt`)).toBeNull()
	})
})

describe('migratePersisted', () => {
	it('turns the legacy shape into progress', () => {
		const result = migratePersisted(
			{ unlockedLetters: ['a', 'b', 'c'], wpmList: [20, 30], wpmMax: 30, sessionCounter: 2 },
			0,
			order,
			2,
		)

		expect(result.progress).toEqual({ unlocked: ['a', 'b', 'c'], stats: {} })
		expect(result.wpmList).toEqual([20, 30])
		expect(result.wpmMax).toBe(30)
		expect(result.sessionCounter).toBe(2)
	})

	it('falls back to defaults for broken legacy data', () => {
		const result = migratePersisted({ unlockedLetters: 'nope' }, 0, order, 2)

		expect(result.progress.unlocked).toEqual(['a', 'b'])
		expect(result.wpmList).toEqual([])
		expect(result.wpmMax).toBe(0)
		expect(result.sessionCounter).toBe(0)
	})

	it('leaves current data untouched', () => {
		const current = {
			progress: { unlocked: ['a'], stats: {} },
			wpmList: [10],
			wpmMax: 10,
			sessionCounter: 1,
		}

		expect(migratePersisted(current, 1, order, 2)).toEqual(current)
	})
})
