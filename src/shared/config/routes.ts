export interface Route {
	label: string
	path: string
}

export const routes: Route[] = [
	{
		label: 'Train',
		path: '/',
	},
	{
		label: 'Stats',
		path: '/stats',
	},
	{
		label: 'Settings',
		path: '/settings',
	},
]
