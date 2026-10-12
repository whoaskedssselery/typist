import { describe, expect, it } from 'vitest'
import { isForeignLayout } from './layout'

const russian = ['а', 'т', 'и']
const english = ['e', 'n', 'i']

describe('isForeignLayout', () => {
	it('flags a latin key while training Cyrillic', () => {
		expect(isForeignLayout('a', russian)).toBe(true)
		expect(isForeignLayout('Q', russian)).toBe(true)
	})

	it('flags a Cyrillic key while training English', () => {
		expect(isForeignLayout('ф', english)).toBe(true)
	})

	it('accepts keys of the same script, even letters outside the alphabet', () => {
		expect(isForeignLayout('ё', russian)).toBe(false)
		expect(isForeignLayout('z', english)).toBe(false)
	})

	it('ignores keys that are not letters', () => {
		expect(isForeignLayout(' ', russian)).toBe(false)
		expect(isForeignLayout('1', russian)).toBe(false)
		expect(isForeignLayout(',', english)).toBe(false)
	})

	it('is false for an empty alphabet', () => {
		expect(isForeignLayout('a', [])).toBe(false)
	})
})
