import Router from './router'
import Header from '@/components/Header'
import { useTypistStore } from '@/store/useTypistStore.ts'
import { Toaster } from 'react-hot-toast'

const App = () => {
	const { theme } = useTypistStore()
	
	return (
		<div className={`app ${theme === 'light' ? 'app--light' : 'app--dark'}`}>
			<Header />
			<Router />
			
			<Toaster
				position={'bottom-right'}
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