const scriptOf = (char: string) => {
	if (/\p{Script=Cyrillic}/u.test(char)) return 'cyrillic'
	if (/\p{Script=Latin}/u.test(char)) return 'latin'
	return null
}

export const isForeignLayout = (key: string, alphabet: string[]) => {
	const expected = scriptOf(alphabet[0] ?? '')
	const typed = scriptOf(key)
	return expected !== null && typed !== null && expected !== typed
}
