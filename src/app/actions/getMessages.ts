import { API_URL, ApiRoutes } from '@/src/lib/api-routes'
import axios from 'axios'

export interface Pagination<T> {
	data: T[]
	page_number: number
	page_size: number
	total_items: number
	total_pages: number
}

export interface Chat {
	name: string
	uuid: string
	id: number
	created_at: string
	state: 'active'
	user_id: number
	history: []
}

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

export async function getRecentMessages(wallet: string): Promise<Message[]> {
	try {
		const data = await axios.get<undefined, Chat>(
			API_URL + ApiRoutes.CHATS_SELECTED + `?wallet_address=${wallet}`
		)

		console.log({ data })

		return data.data.history
	} catch (error) {
		return []
	}
}
