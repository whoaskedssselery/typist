import { Link } from 'react-router-dom'
import './NotFound.scss'

const NotFound = () => (
	<section className="not-found">
		<h2 className="not-found__code">404</h2>
		<p className="not-found__message">Страница не найдена</p>
		<Link to="/" className="not-found__link">
			На главную
		</Link>
	</section>
)

export default NotFound
