import './Settings.scss'
import { useTypistStore } from '@/store/useTypistStore.ts'
import type { FontFamily, FontSize } from '@/types'

const fonts: FontFamily[] = ['JetBrains Mono', 'Fira Code', 'IBM Plex Mono', 'Montserrat Alternates']
const sizes: FontSize[] = ['S', 'M', 'L']

const Settings = () => {
	const {
		resetProgress, toggleTheme, setFontSize,
		fontSize, setFontFamily, textFontFamily, theme
	} = useTypistStore()
	
	return (
		<section className="settings">
			<div className="settings__section">
				<span className="settings__section-title">Шрифт</span>
				<div className="settings__font-switcher">
					{fonts.map(font => (
						<button
							key={font}
							onClick={() => setFontFamily(font)}
							className={`settings__font-button ${textFontFamily === font ? 'settings__font-button--active' : ''}`}
						>
							{font}
						</button>
					))}
				</div>
			</div>
			
			<div className="settings__section">
				<span className="settings__section-title">Размер текста</span>
				<div className="settings__size-buttons">
					{sizes.map(size => (
						<button
							key={size}
							onClick={() => setFontSize(size)}
							className={`settings__size-button ${fontSize === size ? 'settings__size-button--active' : ''}`}
						>
							{size}
						</button>
					))}
				</div>
			</div>
			
			<div className="settings__section">
				<span className="settings__section-title">Тема</span>
				<div className="settings__theme-row">
					<span className="settings__theme-label">{theme === 'light' ? 'Светлая' : 'Тёмная'}</span>
					<button className="settings__theme-button" onClick={toggleTheme}>Сменить</button>
				</div>
			</div>
			
			<div className="settings__section">
				<button className="settings__reset-button" onClick={resetProgress}>
					reset progress
				</button>
			</div>
		</section>
	)
}

export default Settings