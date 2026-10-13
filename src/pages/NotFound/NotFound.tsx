import { Link } from 'react-router-dom'
import { useT } from '@/shared/i18n/useT'
import './NotFound.scss'

const NotFound = () => {
	const t = useT('notFound')

	return (
		<section className="not-found">
			<h2 className="not-found__code">404</h2>
			<p className="not-found__message">{t('message')}</p>
			<Link to="/" className="not-found__link">
				{t('home')}
			</Link>
		</section>
	)
}

export default NotFound
