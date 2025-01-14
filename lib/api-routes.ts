export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

export enum ApiRoutes {
	MESSAGES = '/messages',
	STAT_MESSAGE = '/statistics/messages',
	STAT_USERS = '/statistics/users',
}
