import type { FontFamily, FontSize } from '@/types'
import { useSettingsStore } from '@/store/useSettingsStore.ts'
import useActiveStore from '@/hooks/useActiveStore.ts'
import './Settings.scss'

const fonts: FontFamily[] = ['JetBrains Mono', 'Fira Code', 'IBM Plex Mono', 'Montserrat Alternates']
const sizes: FontSize[] = ['S', 'M', 'L']

const Settings = () => {
	const {
		theme, toggleTheme, fontSize,
		setFontSize, textFontFamily, setFontFamily,
		dailyGoal, setDailyGoal, resetSettings,
		language, toggleLanguage
	} = useSettingsStore()
	const { resetProgress } = useActiveStore()
	
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
			
			<div className="settings__row">
				<div className="settings__section">
					<span className="settings__section-title">Тема</span>
					<div className="settings__card">
						<span className="settings__card-label">{theme === 'light' ? 'Светлая' : 'Тёмная'}</span>
						<button className="settings__card-button" onClick={toggleTheme}>Сменить</button>
					</div>
				</div>
				
				<div className="settings__section">
					<span className="settings__section-title">Язык</span>
					<div className="settings__card">
						<span className="settings__card-label">{language === 'ru' ? 'Русский' : 'Английский'}</span>
						<button className="settings__card-button" onClick={toggleLanguage}>Сменить</button>
					</div>
				</div>
				
				<div className="settings__section">
					<span className="settings__section-title">Дневная цель</span>
					<div className="settings__card">
						<input
							className="settings__input"
							type="number"
							value={dailyGoal}
							onChange={(e) => setDailyGoal(Number(e.target.value))}
						/>
						<span className="settings__card-label">минут</span>
					</div>
				</div>
			</div>
			
			<button className="settings__reset-button" onClick={() => { resetProgress(); resetSettings() }}>
				Сбросить прогресс
			</button>
		</section>
	)
}

export default Settings