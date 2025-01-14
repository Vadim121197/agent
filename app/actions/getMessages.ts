import { API_URL, ApiRoutes } from '@/lib/api-routes'

export enum MessageRole {
	SYSTEM = 'system',
	USER = 'user',
}

export interface Message {
	id: number
	user_id: number
	content: string
	created_at: string
	is_winner: boolean
	role: MessageRole
	tx_hash: string
	full_conversation: null
	wallet: string
}

export async function getRecentMessages(wallet?: string): Promise<Message[]> {
	try {
		const res = await fetch(
			API_URL +
				ApiRoutes.MESSAGES +
				`?page_size=200${wallet ? `&&objects_filter=wallet__eq=${wallet}` : ''}`
		)

		const { data } = await res.json()

		return data
	} catch (error) {
		console.error('Error fetching messages:', error)
		return []
	}
}
