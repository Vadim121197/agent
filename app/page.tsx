import { getGameState } from '@/app/actions/getGameState'
import { getRecentMessages } from '@/app/actions/getMessages'
import { Main } from '@/app/home/components/Main'

export default async function Page() {
	const messages = await getRecentMessages()
	const gameState = await getGameState()

	return <Main messages={messages} gameState={gameState} />
}
