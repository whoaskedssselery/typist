import { NavLink } from 'react-router-dom'
import { routes } from '@/constants/routes'
import { Sun, Moon } from 'lucide-react';
import './Header.scss'
import { useSettingsStore } from '@/store/useSettingsStore.ts'

const Header = () => {
	const { theme, toggleTheme } = useSettingsStore()

	return (
		<header
			className="header"
		>
			<NavLink to="/"><h1 className="header__logo">Typist</h1></NavLink>
			<nav className="header__nav">
				<ul className="header__nav-menu">
					{routes.map(route => (
						<li className="header__nav-item" key={route.path}>
							<NavLink to={route.path} end={route.path === '/'}>{route.label}</NavLink>
						</li>
					))}
				</ul>
			</nav>
			<button className="header__theme-button"
			        onClick={toggleTheme}
			        onMouseDown={(e) => e.preventDefault()}
			>
				{theme === 'light' ? <Sun size={24}/> : <Moon size={24}/>}
			</button>
		</header>
	)
}

export default Header