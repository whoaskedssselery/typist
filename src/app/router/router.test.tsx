import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSettingsStore } from '@/shared/store/useSettingsStore'
import Router from './index'

const renderAt = (path: string) =>
	render(
		<MemoryRouter initialEntries={[path]}>
			<Router />
		</MemoryRouter>,
	)

beforeEach(() => useSettingsStore.setState({ uiLanguage: 'ru' }))

describe('Router', () => {
	it('shows the 404 page for an unknown path', () => {
		renderAt('/nope')

		expect(screen.getByText('404')).toBeInTheDocument()
		expect(screen.getByRole('link', { name: 'На главную' })).toHaveAttribute('href', '/')
	})

	it('translates the 404 page into the interface language', () => {
		useSettingsStore.setState({ uiLanguage: 'en' })

		renderAt('/nope')

		expect(screen.getByText('Page not found')).toBeInTheDocument()
	})
})
