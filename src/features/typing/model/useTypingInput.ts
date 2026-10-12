import { useEffect, useRef } from 'react'
import { isForeignLayout } from '@/entities/typist/core'

type TypingInputOptions = {
	alphabet: string[]
	press: (key: string, now: number) => void
	restart: () => void
	onForeignLayout: () => void
}

export const useTypingInput = (options: TypingInputOptions) => {
	const latest = useRef(options)
	useEffect(() => {
		latest.current = options
	})

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.isComposing || event.repeat) return
			if (event.ctrlKey || event.altKey || event.metaKey) return

			const { alphabet, press, restart, onForeignLayout } = latest.current

			if (event.key === 'Escape') {
				restart()
				return
			}
			if (event.key.length !== 1) return

			if (event.key === ' ') event.preventDefault()

			if (isForeignLayout(event.key, alphabet)) {
				onForeignLayout()
				return
			}
			press(event.key, performance.now())
		}

		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [])
}
