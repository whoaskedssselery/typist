import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Router from './index'

describe('Router', () => {
	it('shows the 404 page for an unknown path', () => {
		render(
			<MemoryRouter initialEntries={['/nope']}>
				<Router />
			</MemoryRouter>,
		)

		expect(screen.getByText('404')).toBeInTheDocument()
		expect(screen.getByRole('link', { name: 'На главную' })).toHaveAttribute('href', '/')
	})
})
