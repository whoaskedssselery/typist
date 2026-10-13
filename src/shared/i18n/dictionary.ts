import type { Language } from '@/shared/store/settings.types'

export type Localized = Record<Language, string>

const t = (ru: string, en: string): Localized => ({ ru, en })

export const dictionary = {
	nav: {
		train: t('Тренировка', 'Train'),
		stats: t('Статистика', 'Stats'),
		settings: t('Настройки', 'Settings'),
	},
	train: {
		metrics: t('Метрики', 'Metrics'),
		speed: t('Скорость', 'Speed'),
		accuracy: t('Точность', 'Accuracy'),
		wpm: t('wpm', 'wpm'),
		allLetters: t('Все буквы', 'All letters'),
		dailyGoal: t('Дневная цель', 'Daily goal'),
		minutesShort: t('мин', 'min'),
	},
	stats: {
		minutes: t('минут', 'minutes'),
		session: t('Сессия', 'Session'),
	},
	settings: {
		font: t('Шрифт', 'Font'),
		textSize: t('Размер текста', 'Text size'),
		theme: t('Тема', 'Theme'),
		themeLight: t('Светлая', 'Light'),
		themeDark: t('Тёмная', 'Dark'),
		change: t('Сменить', 'Switch'),
		interfaceLanguage: t('Язык интерфейса', 'Interface language'),
		trainingLanguage: t('Язык тренировки', 'Training language'),
		dailyGoal: t('Дневная цель', 'Daily goal'),
		minutes: t('минут', 'minutes'),
		progress: t('Прогресс', 'Progress'),
		export: t('Экспорт', 'Export'),
		import: t('Импорт', 'Import'),
		reset: t('Сбросить прогресс', 'Reset progress'),
	},
	notFound: {
		message: t('Страница не найдена', 'Page not found'),
		home: t('На главную', 'Back to the trainer'),
	},
	toasts: {
		letterUnlocked: t('Открыта буква {letter}!', 'Letter {letter} unlocked!'),
		layoutRu: t('Переключите раскладку на русскую', 'Switch your keyboard layout to Russian'),
		layoutEn: t('Переключите раскладку на английскую', 'Switch your keyboard layout to English'),
		fontChanged: t('Шрифт изменён на {font}', 'Font changed to {font}'),
		sizeChanged: t('Размер текста изменён на {size}', 'Text size changed to {size}'),
		progressReset: t('Прогресс сброшен', 'Progress reset'),
		progressExported: t('Прогресс сохранён в файл', 'Progress saved to a file'),
		progressImported: t('Прогресс загружен', 'Progress loaded'),
		importTooLarge: t('Файл слишком большой', 'The file is too large'),
		importInvalidJson: t('Это не JSON-файл', 'This is not a JSON file'),
		importInvalidFormat: t(
			'Файл не похож на прогресс Typist',
			'This does not look like Typist progress',
		),
		importUnsupportedVersion: t(
			'Файл создан более новой версией Typist',
			'The file was made by a newer version of Typist',
		),
		dataCorrupted: t(
			'Часть сохранённых данных была повреждена и сброшена. Копия лежит в localStorage.',
			'Some saved data was corrupt and has been reset. A copy is kept in localStorage.',
		),
	},
} as const
