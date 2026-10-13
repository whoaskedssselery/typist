import { describe, expect, it } from 'vitest'
import { translate } from './translate'

describe('translate', () => {
	it('returns the text for the requested language', () => {
		expect(translate('ru', 'nav', 'stats')).toBe('Статистика')
		expect(translate('en', 'nav', 'stats')).toBe('Stats')
	})

	it('fills in parameters', () => {
		expect(translate('en', 'toasts', 'letterUnlocked', { letter: 'Т' })).toBe('Letter Т unlocked!')
		expect(translate('ru', 'toasts', 'letterUnlocked', { letter: 'Т' })).toBe('Открыта буква Т!')
	})

	it('leaves an unknown placeholder visible instead of printing undefined', () => {
		expect(translate('en', 'toasts', 'letterUnlocked', {})).toBe('Letter {letter} unlocked!')
	})
})
