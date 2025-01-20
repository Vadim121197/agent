export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

export enum ApiRoutes {
	CHATS = '/chats',
	CHATS_SELECTED = '/chats/selected',
	MESSAGES = '/messages',
	STAT_MESSAGE = '/statistics/messages',
	STAT_USERS = '/statistics/users',
}
