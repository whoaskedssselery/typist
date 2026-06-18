import Router from './router'
import Header from '@/components/Header'
import { useTypistStore } from '@/store/useTypistStore.ts'

const App = () => {
	const { theme } = useTypistStore()
	
	return (
		<div className={`app ${theme === 'light' ? 'app--light' : 'app--dark'}`}>
			<Header />
			<Router />
		</div>
	)
}

export default App