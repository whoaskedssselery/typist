const reports = new Set<string>()

export const reportCorruption = (storeName: string) => {
	reports.add(storeName)
}

export const takeCorruptionReports = () => {
	const taken = [...reports]
	reports.clear()
	return taken
}
