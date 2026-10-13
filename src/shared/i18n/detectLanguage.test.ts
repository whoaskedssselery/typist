import { afterEach, describe, expect, it, vi } from 'vitest'
import { detectLanguage } from './detectLanguage'

afterEach(() => vi.unstubAllGlobals())

const withBrowserLanguage = (language: string) =>
	vi.stubGlobal('navigator', { language, languages: [language] })

describe('detectLanguage', () => {
	it('picks Russian for Russian browsers', () => {
		withBrowserLanguage('ru-RU')

		expect(detectLanguage()).toBe('ru')
	})

	it('picks English for everything else', () => {
		withBrowserLanguage('de-DE')

		expect(detectLanguage()).toBe('en')
	})

	it('falls back to English when the browser gives nothing', () => {
		vi.stubGlobal('navigator', {})

		expect(detectLanguage()).toBe('en')
	})
})
