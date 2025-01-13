import { parseEther } from 'viem'

type SessionWithPrice = {
	sessionId: string
	price: string
}

export async function getSessionWithPrice(
	userWallet: string
): Promise<SessionWithPrice> {
	try {
		// Placeholder implementation
		return {
			sessionId: 'session_' + Date.now().toString(),
			price: parseEther('0.0002').toString(), // Price in wei
		}
	} catch (error) {
		console.error('Error getting session with price:', error)
		throw error
	}
}
