import { API_URL, ApiRoutes } from '@/src/lib/api-routes'
import axios from 'axios'
import moment from 'moment'

export type GameState = {
	uniqueWallets: number
	messagesCount: number
	endgameTime: string
	isGameEnded: boolean
}

export async function getGameState(): Promise<GameState> {
	try {
		const { data: usersData } = await axios.get<
			undefined,
			{ data: { total_users: number } }
		>(API_URL + ApiRoutes.STAT_USERS)

		const { data: messagesData } = await axios.get<
			undefined,
			{ data: { total_messages: number } }
		>(API_URL + ApiRoutes.STAT_MESSAGE)

		return {
			uniqueWallets: usersData.total_users,
			messagesCount: messagesData.total_messages,
			endgameTime: moment().add(72, 'hours').toString(), // 24 hours from now
			isGameEnded: false,
		}
	} catch (error) {
		return {
			uniqueWallets: 0,
			messagesCount: 0,
			endgameTime: moment().add(72, 'hours').toString(), // 24 hours from now
			isGameEnded: false,
		}
	}
}
