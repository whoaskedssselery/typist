import { useRef } from 'react'
import toast from 'react-hot-toast'
import { useActiveStore } from '@/entities/typist/model/useActiveStore'
import { exportProgress, importProgress } from '@/features/progress-transfer/model/transferProgress'
import { useT } from '@/shared/i18n/useT'
import { downloadTextFile } from '@/shared/lib/files'
import type { FontFamily, FontSize, Language } from '@/shared/store/settings.types'
import { useSettingsStore } from '@/shared/store/useSettingsStore'
import './Settings.scss'

const fonts: FontFamily[] = [
	'JetBrains Mono',
	'Fira Code',
	'IBM Plex Mono',
	'Montserrat Alternates',
]
const sizes: FontSize[] = ['S', 'M', 'L']
const languageNames: Record<Language, string> = { ru: 'Русский', en: 'English' }
const otherLanguage = (language: Language): Language => (language === 'ru' ? 'en' : 'ru')

const IMPORT_ERROR_KEYS = {
	'too-large': 'importTooLarge',
	'invalid-json': 'importInvalidJson',
	'invalid-format': 'importInvalidFormat',
	'unsupported-version': 'importUnsupportedVersion',
} as const

const Settings = () => {
	const {
		theme,
		toggleTheme,
		fontSize,
		setFontSize,
		textFontFamily,
		setFontFamily,
		dailyGoal,
		setDailyGoal,
		resetSettings,
		uiLanguage,
		setUiLanguage,
		trainingLanguage,
		setTrainingLanguage,
	} = useSettingsStore()
	const resetProgress = useActiveStore((state) => state.reset)
	const t = useT('settings')
	const tToast = useT('toasts')

	const fileInput = useRef<HTMLInputElement>(null)

	const handleExport = async () => {
		downloadTextFile('typist-progress.json', await exportProgress())
		toast.success(tToast('progressExported'))
	}

	const handleImport = async (file: File | undefined) => {
		if (!file) return
		const result = await importProgress(await file.text())
		if (fileInput.current) fileInput.current.value = ''
		if (result.ok) toast.success(tToast('progressImported'))
		else toast.error(tToast(IMPORT_ERROR_KEYS[result.error]))
	}

	const handleFontFamily = (font: FontFamily) => {
		setFontFamily(font)
		toast.success(tToast('fontChanged', { font }))
	}

	const handleFontSize = (size: FontSize) => {
		setFontSize(size)
		toast.success(tToast('sizeChanged', { size }))
	}

	const handleReset = () => {
		resetProgress()
		resetSettings()
		toast.success(tToast('progressReset'))
	}

	return (
		<section className="settings">
			<div className="settings__section">
				<span className="settings__section-title">{t('font')}</span>
				<div className="settings__font-switcher">
					{fonts.map((font) => (
						<button
							type="button"
							key={font}
							onClick={() => handleFontFamily(font)}
							className={`settings__font-button ${textFontFamily === font ? 'settings__font-button--active' : ''}`}
						>
							{font}
						</button>
					))}
				</div>
			</div>

			<div className="settings__section">
				<span className="settings__section-title">{t('textSize')}</span>
				<div className="settings__size-buttons">
					{sizes.map((size) => (
						<button
							type="button"
							key={size}
							onClick={() => handleFontSize(size)}
							className={`settings__size-button ${fontSize === size ? 'settings__size-button--active' : ''}`}
						>
							{size}
						</button>
					))}
				</div>
			</div>

			<div className="settings__row">
				<div className="settings__section">
					<span className="settings__section-title">{t('theme')}</span>
					<div className="settings__card">
						<span className="settings__card-label">
							{theme === 'light' ? t('themeLight') : t('themeDark')}
						</span>
						<button type="button" className="settings__card-button" onClick={toggleTheme}>
							{t('change')}
						</button>
					</div>
				</div>

				<div className="settings__section">
					<span className="settings__section-title">{t('interfaceLanguage')}</span>
					<div className="settings__card">
						<span className="settings__card-label">{languageNames[uiLanguage]}</span>
						<button
							type="button"
							className="settings__card-button"
							onClick={() => setUiLanguage(otherLanguage(uiLanguage))}
						>
							{t('change')}
						</button>
					</div>
				</div>

				<div className="settings__section">
					<span className="settings__section-title">{t('trainingLanguage')}</span>
					<div className="settings__card">
						<span className="settings__card-label">{languageNames[trainingLanguage]}</span>
						<button
							type="button"
							className="settings__card-button"
							onClick={() => setTrainingLanguage(otherLanguage(trainingLanguage))}
						>
							{t('change')}
						</button>
					</div>
				</div>

				<div className="settings__section">
					<span className="settings__section-title">{t('dailyGoal')}</span>
					<div className="settings__card">
						<input
							className="settings__input"
							type="number"
							min="1"
							value={dailyGoal}
							onChange={(e) => setDailyGoal(Math.max(1, Number(e.target.value)))}
						/>
						<span className="settings__card-label">{t('minutes')}</span>
					</div>
				</div>
			</div>

			<div className="settings__section">
				<span className="settings__section-title">{t('progress')}</span>
				<div className="settings__card">
					<button type="button" className="settings__card-button" onClick={handleExport}>
						{t('export')}
					</button>
					<button
						type="button"
						className="settings__card-button"
						onClick={() => fileInput.current?.click()}
					>
						{t('import')}
					</button>
					<input
						ref={fileInput}
						type="file"
						accept="application/json,.json"
						hidden
						onChange={(event) => handleImport(event.target.files?.[0])}
					/>
				</div>
			</div>

			<button type="button" className="settings__reset-button" onClick={handleReset}>
				{t('reset')}
			</button>
		</section>
	)
}

export default Settings
