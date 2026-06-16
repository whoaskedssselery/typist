import {Route, Routes} from 'react-router-dom'
import Train from '../pages/Train'
import Settings from '../pages/Settings'
import Stats from '../pages/Stats'

const Router = () => {
	return (
		<Routes>
			<Route path="/" element={<Train />} />
			<Route path="/stats" element={<Stats />} />
			<Route path="/settings" element={<Settings />} />
		</Routes>
	)
}

export default Router