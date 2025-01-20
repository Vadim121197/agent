'use client'

import {
	NumberTickerDemo,
	TypingAnimationDemo,
} from '@/src/components/animations'
import { AnimatePresence, motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { ConversationModal } from './Chat/ConversationModal'
import { HowItWorks } from './Chat/HowItWorks'
import { Stats } from './Chat/Stats'
import { getRecentMessages, Message } from '../../actions/getMessages'
import { GameState, getGameState } from '../../actions/getGameState'
import { usePrizeFund } from '../../../hooks/prize-fund'
import { Chat } from './Chat/Chat'
import { Header } from './Header'

export const Main = (props: { gameState: GameState }) => {
	const prizeFund = usePrizeFund()
	const [messages, setMessages] = useState<Message[]>([])
	const [gameState, setGameState] = useState<GameState>(props.gameState)
	const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
	const [showOnlyUserMessages, setShowOnlyUserMessages] = useState(false)
	const { address } = useAccount()

	const queryNewMessages = useCallback(async () => {
		if (!address) return
		const newMessages = await getRecentMessages(address)

		setMessages(newMessages)

		const newGameState = await getGameState()

		setGameState(newGameState)
	}, [address])

	// Poll for new messages every 5 seconds
	useEffect(() => {
		queryNewMessages()
		const interval = setInterval(queryNewMessages, 5000)
		return () => clearInterval(interval)
	}, [queryNewMessages])

	return (
		<div className='h-screen flex flex-col overflow-hidden'>
			{/* Main Content */}
			<Header gameState={gameState} prizeFund={prizeFund ?? 0} />
			<div className='flex-1 flex overflow-hidden'>
				{/* Left Column */}
				<motion.div
					className='hidden lg:block w-1/4 min-w-[300px] max-w-[400px] overflow-y-auto'
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{
						duration: 0.8,
						delay: 3.5, // Starts after the chat animation
						ease: [0.23, 1, 0.32, 1],
					}}
				>
					<HowItWorks />

					<Stats
						totalParticipants={gameState.uniqueWallets}
						totalMessages={gameState.messagesCount}
						prizeFund={prizeFund ?? 0}
						endgameTime={gameState.endgameTime}
						className='mt-8'
						isGameEnded={gameState.isGameEnded}
					/>
				</motion.div>

				{/* Center Column */}
				<div className='flex-1 flex flex-col overflow-hidden px-4 lg:px-8'>
					<motion.div
						className='flex-shrink-0 text-center pb-1 max-w-3xl mx-auto w-full'
						initial={{ y: '50vh', translateY: '-50%' }}
						animate={{ y: 0, translateY: 0 }}
						transition={{
							duration: 0.5,
							delay: 2.5,
							ease: [0.23, 1, 0.32, 1],
						}}
					>
						<NumberTickerDemo
							className='mb-4 text-2xl lg:text-3xl'
							prizeFund={prizeFund}
						/>
						<div className='relative inline-flex items-center gap-3'>
							<div className='w-12 h-12 rounded-full bg-violet-500/90 flex items-center justify-center flex-shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.06)]'>
								<Shield className='w-12 h-12 text-white rounded-full' />
							</div>

							<div className='relative inline-block'>
								<div className='bg-white rounded-[2rem] px-8 flex items-center h-[4.5rem] py-10 shadow-[0_2px_10px_rgba(0,0,0,0.06)]'>
									<TypingAnimationDemo />
									<div
										className='absolute left-[-12px] top-1/2 -translate-y-1/2'
										style={{
											width: '20px',
											height: '20px',
											background: 'white',
											clipPath:
												'polygon(100% 0, 0 50%, 100% 100%, 100% 55%, 100% 45%)',
										}}
									>
										<div className='w-full h-full bg-white'></div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>

					<div className='flex-1 min-h-0 flex justify-center'>
						<motion.div
							className='h-full rounded-3xl overflow-hidden max-w-3xl w-full'
							initial={{ opacity: 0, scale: 1.02 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{
								duration: 1,
								delay: 3,
								ease: [0.23, 1, 0.32, 1],
							}}
						>
							<Chat
								messages={messages}
								queryNewMessages={queryNewMessages}
								showOnlyUserMessages={showOnlyUserMessages}
								setShowOnlyUserMessages={setShowOnlyUserMessages}
								isGameEnded={gameState.isGameEnded}
							/>
						</motion.div>
					</div>
				</div>

				{/* Right Column */}
				<div className='hidden lg:block w-1/4 min-w-[300px] max-w-[400px] overflow-y-auto'>
					{/* Empty right column with same width as left */}
				</div>
			</div>

			{/* Modal */}
			<AnimatePresence>
				{selectedMessage?.tx_hash && (
					<ConversationModal
						messageId={selectedMessage.tx_hash}
						onClose={() => setSelectedMessage(null)}
					/>
				)}
			</AnimatePresence>
		</div>
	)
}
