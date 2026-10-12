import Router from '@/app/router'
import Header from '@/widgets/Header'
import { useSettingsStore } from '@/shared/store/useSettingsStore'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

const App = () => {
	const { theme, textFontFamily, fontSize } = useSettingsStore()
	
	useEffect(() => {
		document.documentElement.style.setProperty('--font-text', textFontFamily)
	}, [textFontFamily])
	useEffect(() => {
		const sizes = { S: '20px', M: '26px', L: '32px' }
		document.documentElement.style.setProperty('--font-size-text', sizes[fontSize])
	}, [fontSize])
	
	return (
		<div className={`app ${theme === 'light' ? 'app--light' : 'app--dark'}`}>
			<Header />
			<Router />
			
			<Toaster
				position={'top-right'}
				toastOptions={{
					style: {
						background: theme === 'dark' ? '#25262b' : '#e8e4de',
						color: theme === 'dark' ? '#e8e8e8' : '#2a2a2a',
						fontSize: '16px',
						padding: '12px 20px',
						borderRadius: '12px',
					},
					duration: 2000,
				}}
			/>
		</div>
	)
}

export default App