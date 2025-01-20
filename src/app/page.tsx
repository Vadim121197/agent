import { getGameState } from './actions/getGameState'
import { Main } from './home/components/Main'

export default async function Page() {
	const gameState = await getGameState()

	return <Main gameState={gameState} />
}
