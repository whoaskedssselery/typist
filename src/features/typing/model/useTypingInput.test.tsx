import { fireEvent, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useTypingInput } from './useTypingInput'

const setup = (alphabet = ['а', 'т', 'и']) => {
	const handlers = { press: vi.fn(), restart: vi.fn(), onForeignLayout: vi.fn() }
	renderHook(() => useTypingInput({ ...handlers, alphabet }))
	return handlers
}

const press = (key: string, init: KeyboardEventInit = {}) =>
	fireEvent.keyDown(window, { key, ...init })

describe('useTypingInput', () => {
	it('forwards printable keys with a timestamp', () => {
		const { press: onPress } = setup()

		press('а')

		expect(onPress).toHaveBeenCalledTimes(1)
		expect(onPress).toHaveBeenCalledWith('а', expect.any(Number))
	})

	it('forwards the space key and prevents page scrolling', () => {
		const { press: onPress } = setup()

		const notCancelled = fireEvent.keyDown(window, { key: ' ' })

		expect(onPress).toHaveBeenCalledWith(' ', expect.any(Number))
		expect(notCancelled).toBe(false)
	})

	it('ignores non-printable keys', () => {
		const { press: onPress } = setup()

		press('Shift')
		press('Enter')
		press('ArrowLeft')

		expect(onPress).not.toHaveBeenCalled()
	})

	it('ignores shortcuts with Ctrl, Alt or Meta', () => {
		const { press: onPress } = setup()

		press('а', { ctrlKey: true })
		press('а', { altKey: true })
		press('а', { metaKey: true })

		expect(onPress).not.toHaveBeenCalled()
	})

	it('ignores auto-repeat and IME composition', () => {
		const { press: onPress } = setup()

		press('а', { repeat: true })
		press('а', { isComposing: true })

		expect(onPress).not.toHaveBeenCalled()
	})

	it('restarts the set on Escape', () => {
		const { restart, press: onPress } = setup()

		press('Escape')

		expect(restart).toHaveBeenCalledTimes(1)
		expect(onPress).not.toHaveBeenCalled()
	})

	it('reports a foreign layout instead of counting an error', () => {
		const { press: onPress, onForeignLayout } = setup()

		press('q')

		expect(onForeignLayout).toHaveBeenCalledTimes(1)
		expect(onPress).not.toHaveBeenCalled()
	})

	it('stops listening after unmount', () => {
		const handlers = { press: vi.fn(), restart: vi.fn(), onForeignLayout: vi.fn() }
		const { unmount } = renderHook(() => useTypingInput({ ...handlers, alphabet: ['а'] }))

		unmount()
		press('а')

		expect(handlers.press).not.toHaveBeenCalled()
	})
})
