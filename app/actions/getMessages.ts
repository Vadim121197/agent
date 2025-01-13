// export type TMessage = {
// 	id: string
// 	content: string
// 	role: 'user' | 'assistant' | 'system'
// 	userWallet?: string
// 	createdAt: Date
// 	isWinner?: boolean
// 	fullConversation?: string
// 	txHash?: string
// }
import { API_URL, ApiRoutes } from '@/lib/api-routes'

export type TMessage = {
	id: number
	user_id: number
	decision: 'reject'
	response: string
	content: string
	created_at: string
}

export async function getRecentMessages(
	userWallet?: string,
	limit: number = 50
): Promise<TMessage[]> {
	try {
		const res = await fetch(API_URL + ApiRoutes.MESSAGES + `?page_size=200`)

		const { data } = await res.json()

		return data as TMessage[]
	} catch (error) {
		console.error('Error fetching messages:', error)
		return []
	}
}

export async function getMessageByTxHash(
	txHash: string
): Promise<TMessage | undefined> {
	try {
		// const result = await db
		//   .select()
		//   .from(messages)
		//   .where(eq(messages.txHash, txHash))
		//   .limit(1);
		//
		// if (result.length === 0) return undefined;
		//
		// const msg = result[0];
		// return {
		//   id: msg.id,
		//   content: msg.content,
		//   role: msg.role,
		//   userWallet: msg.userWallet,
		//   createdAt: msg.createdAt,
		//   isWinner: msg.isWinner,
		//   fullConversation: msg.fullConversation,
		//   txHash: msg.txHash,
		// };
		return
	} catch (error) {
		console.error('Error fetching message by txHash:', error)
		return undefined
	}
}
