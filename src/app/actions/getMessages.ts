import { API_URL, ApiRoutes } from '@/src/lib/api-routes'
import axios from 'axios'

export interface Chat {
	name: string
	uuid: string
	id: number
	created_at: string
	state: 'active'
	user_id: number
	history: Message[]
}

export enum MessageRole {
	SYSTEM = 'system',
	USER = 'user',
}

export interface Message {
	content: string
	decision?: 'reject'
	is_approved: boolean
	role: MessageRole
	timestamp: number
	tx_hash?: string
}

export async function getRecentMessages(wallet: string): Promise<Message[]> {
	try {
		const data = await axios.get<undefined, Chat>(
			API_URL + ApiRoutes.CHATS_SELECTED + `?wallet_address=${wallet}`
		)

		return data.data.history
	} catch (error) {
		return []
	}
}
