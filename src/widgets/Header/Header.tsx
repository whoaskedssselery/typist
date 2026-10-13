import { Moon, Sun } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { routes } from '@/shared/config/routes'
import { useT } from '@/shared/i18n/useT'
import './Header.scss'
import { useSettingsStore } from '@/shared/store/useSettingsStore'

const Header = () => {
	const { theme, toggleTheme } = useSettingsStore()
	const t = useT('nav')

	return (
		<header className="header">
			<NavLink to="/">
				<h1 className="header__logo">Typist</h1>
			</NavLink>
			<nav className="header__nav">
				<ul className="header__nav-menu">
					{routes.map((route) => (
						<li className="header__nav-item" key={route.path}>
							<NavLink to={route.path} end={route.path === '/'}>
								{t(route.key)}
							</NavLink>
						</li>
					))}
				</ul>
			</nav>
			<button
				type="button"
				className="header__theme-button"
				onClick={toggleTheme}
				onMouseDown={(e) => e.preventDefault()}
			>
				{theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}
			</button>
		</header>
	)
}

export default Header
