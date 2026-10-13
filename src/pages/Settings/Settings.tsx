import { useRef } from 'react'
import toast from 'react-hot-toast'
import { useActiveStore } from '@/entities/typist/model/useActiveStore'
import { exportProgress, importProgress } from '@/features/progress-transfer/model/transferProgress'
import { downloadTextFile } from '@/shared/lib/files'
import type { FontFamily, FontSize } from '@/shared/store/settings.types'
import { useSettingsStore } from '@/shared/store/useSettingsStore'
import './Settings.scss'

const fonts: FontFamily[] = [
	'JetBrains Mono',
	'Fira Code',
	'IBM Plex Mono',
	'Montserrat Alternates',
]
const IMPORT_ERRORS = {
	'too-large': 'Файл слишком большой',
	'invalid-json': 'Это не JSON-файл',
	'invalid-format': 'Файл не похож на прогресс Typist',
	'unsupported-version': 'Файл создан более новой версией Typist',
}
const sizes: FontSize[] = ['S', 'M', 'L']

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
		language,
		toggleLanguage,
	} = useSettingsStore()
	const resetProgress = useActiveStore((state) => state.reset)

	const fileInput = useRef<HTMLInputElement>(null)

	const handleExport = async () => {
		downloadTextFile('typist-progress.json', await exportProgress())
		toast.success('Прогресс сохранён в файл')
	}

	const handleImport = async (file: File | undefined) => {
		if (!file) return
		const result = await importProgress(await file.text())
		if (fileInput.current) fileInput.current.value = ''
		if (result.ok) toast.success('Прогресс загружен')
		else toast.error(IMPORT_ERRORS[result.error])
	}

	const handleFontFamily = (font: FontFamily) => {
		setFontFamily(font)
		toast.success(`Шрифт изменён на ${font}`)
	}

	const handleFontSize = (size: FontSize) => {
		setFontSize(size)
		toast.success(`Размер текста изменён на ${size}`)
	}

	const handleReset = () => {
		resetProgress()
		resetSettings()
		toast.success('Прогресс сброшен')
	}

	return (
		<section className="settings">
			<div className="settings__section">
				<span className="settings__section-title">Шрифт</span>
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
				<span className="settings__section-title">Размер текста</span>
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
					<span className="settings__section-title">Тема</span>
					<div className="settings__card">
						<span className="settings__card-label">{theme === 'light' ? 'Светлая' : 'Тёмная'}</span>
						<button type="button" className="settings__card-button" onClick={toggleTheme}>
							Сменить
						</button>
					</div>
				</div>

				<div className="settings__section">
					<span className="settings__section-title">Язык</span>
					<div className="settings__card">
						<span className="settings__card-label">
							{language === 'ru' ? 'Русский' : 'Английский'}
						</span>
						<button type="button" className="settings__card-button" onClick={toggleLanguage}>
							Сменить
						</button>
					</div>
				</div>

				<div className="settings__section">
					<span className="settings__section-title">Дневная цель</span>
					<div className="settings__card">
						<input
							className="settings__input"
							type="number"
							min="1"
							value={dailyGoal}
							onChange={(e) => setDailyGoal(Math.max(1, Number(e.target.value)))}
						/>
						<span className="settings__card-label">минут</span>
					</div>
				</div>
			</div>

			<div className="settings__section">
				<span className="settings__section-title">Прогресс</span>
				<div className="settings__card">
					<button type="button" className="settings__card-button" onClick={handleExport}>
						Экспорт
					</button>
					<button
						type="button"
						className="settings__card-button"
						onClick={() => fileInput.current?.click()}
					>
						Импорт
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
				Сбросить прогресс
			</button>
		</section>
	)
}

export default Settings
