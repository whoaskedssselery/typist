import { routes } from '@/constants/routes'
import './Header.scss'
import {NavLink} from 'react-router-dom'

const Header = () => {
	return (
		<header
			className="header"
		>
			<NavLink to="/"><h1 className="header__logo">Typist</h1></NavLink>
			<nav className="header__nav">
				<ul className="header__nav-menu">
					{routes.map(route => (
						<li className="header__nav-item" key={route.path}>
							<NavLink to={route.path}>{route.label}</NavLink>
						</li>
					))}
				</ul>
			</nav>
		</header>
	)
}

export default Header