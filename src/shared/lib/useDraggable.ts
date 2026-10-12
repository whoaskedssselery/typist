import type { MouseEvent as ReactMouseEvent, RefObject } from 'react'
import { useEffect, useState } from 'react'

const useDraggable = (ref: RefObject<HTMLElement | null>) => {
	const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
	const [readyToDrag, setReadyToDrag] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => {
			if (ref.current) {
				const rect = ref.current.getBoundingClientRect()
				setPosition({ x: rect.left, y: rect.top })
				setReadyToDrag(true)
			}
		}, 500)

		return () => clearTimeout(timer)
	}, [])

	const onMouseDown = (event: ReactMouseEvent) => {
		const offset = { x: event.clientX - position.x, y: event.clientY - position.y }

		const onMouseMove = (e: MouseEvent) => {
			setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y })
		}

		const onMouseUp = () => {
			window.removeEventListener('mousemove', onMouseMove)
			window.removeEventListener('mouseup', onMouseUp)
		}

		window.addEventListener('mousemove', onMouseMove)
		window.addEventListener('mouseup', onMouseUp)
	}

	return { position, onMouseDown, readyToDrag }
}

export default useDraggable
