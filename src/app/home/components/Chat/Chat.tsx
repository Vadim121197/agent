import React, { useCallback, useEffect, useRef, useState } from 'react'

import { getRecentMessages, Message } from '@/src/app/actions/getMessages'
import { MessageAnimation } from '@/src/components/animations'
import { bondingCurveAbi } from '@/src/lib/abi/bonding-curve'
import { Addresses, chainAddresses } from '@/src/lib/chains'
import { config } from '@/src/lib/wagmi'
import { Switch } from '@headlessui/react'
import {
	estimateGas,
	readContract,
	waitForTransactionReceipt,
	writeContract,
} from '@wagmi/core'
import { createPortal } from 'react-dom'
import { encodeFunctionData, sha256 } from 'viem'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { ChatMessage } from './ChatMessage'
import { ConversationModal } from './ConversationModal'
import axios from 'axios'
import { API_URL, ApiRoutes } from '@/src/lib/api-routes'

type TProps = {
	messages: Message[]
	className?: string
	queryNewMessages: () => Promise<void>
	showOnlyUserMessages: boolean
	setShowOnlyUserMessages: (showOnlyUserMessages: boolean) => void
	isGameEnded: boolean
}

type TransactionStatus = 'idle' | 'pending' | 'error'

export const Chat = ({
	messages,
	queryNewMessages,
	showOnlyUserMessages,
	setShowOnlyUserMessages,
	isGameEnded,
}: TProps) => {
	const [prompt, setPrompt] = useState('')
	const [status, setStatus] = useState<TransactionStatus>('idle')
	const [error, setError] = useState<string>('')
	const { address } = useAccount()
	const { data: balance } = useBalance({
		address,
	})
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const lastMessageRef = useRef<string | null>(null)
	const lastMessageContentRef = useRef<string | null>(null)
	const [selectedMessageTxHash, setSelectedMessageTxHash] = useState<
		string | null
	>(null)
	const [textareaHeight, setTextareaHeight] = useState(40)
	const [msgPrice, setMsgPrice] = useState<bigint>(BigInt(0))
	const chainId = useChainId()

	useEffect(() => {
		void (async () => {
			const price = await readContract(config, {
				abi: bondingCurveAbi,
				address: chainAddresses[chainId][Addresses.PAYMENT],
				functionName: 'FIXED_MESSAGE_PRICE',
			})

			setMsgPrice(price)
		})()
	}, [])
	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}

	const handleSend = async () => {
		try {
			if (!address) {
				setError('Please connect your wallet first')
				return
			}

			if (!prompt.trim()) {
				setError('Please enter a message')
				return
			}

			setStatus('pending')
			setError('')

			const hashedPrompt = sha256(Buffer.from(prompt, 'utf-8'))

			const gas = await estimateGas(config, {
				to: chainAddresses[chainId][Addresses.PAYMENT],
				data: encodeFunctionData({
					abi: bondingCurveAbi,
					args: [hashedPrompt],
					functionName: 'buyIn',
				}),
				value: msgPrice,
			})

			const hash = await writeContract(config, {
				address: chainAddresses[chainId][Addresses.PAYMENT],
				abi: bondingCurveAbi,
				functionName: 'buyIn',
				args: [hashedPrompt],
				value: BigInt(msgPrice),
				gas,
			})

			if (!messages.length) {
				try {
					await axios.post(
						API_URL + ApiRoutes.CHATS + `?wallet_address=${address}`
					)
				} catch (error) {
					console.log({ error })
				}
			}

			await axios.post(
				API_URL + ApiRoutes.CHATS_SELECTED + `?wallet_address=${address}`,
				{
					message: prompt,
					timestamp: Date.now(),
					transaction_hash: hash,
					context_data: {},
				}
			)

			await getRecentMessages(address)

			await waitForTransactionReceipt(config, { hash })

			await queryNewMessages()
			setStatus('idle')
			setPrompt('')
			setTextareaHeight(40)
		} catch (error) {
			console.error('Error in handleSend:', error)
			setStatus('error')
			setError(error instanceof Error ? error.message : 'Something went wrong')
		}
	}

	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' })

			setTimeout(() => {
				messagesEndRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'end',
				})
			}, 100)
		}
	}

	// Initial scroll on mount
	useEffect(() => {
		scrollToBottom()
		if (messages.length > 0) {
			lastMessageContentRef.current = messages[messages.length - 1].content
		}
	}, [])

	// Handle new messages
	useEffect(() => {
		if (messages.length > 0) {
			const currentLastMessage = messages[messages.length - 1]

			// Check if the last message content is different
			if (currentLastMessage.content !== lastMessageContentRef.current) {
				scrollToBottom()
				lastMessageRef.current = String(currentLastMessage.timestamp)
			}

			lastMessageContentRef.current = currentLastMessage.content
		}
	}, [messages])

	// Add effect to refresh messages when toggle changes
	useEffect(() => {
		queryNewMessages()
	}, [showOnlyUserMessages, queryNewMessages])

	// Modify the toggle handler to refresh messages immediately
	const handleToggleUserMessages = useCallback(
		async (checked: boolean) => {
			setShowOnlyUserMessages(checked)
			// Messages will be refreshed by the effect in Main component
		},
		[setShowOnlyUserMessages]
	)

	const renderModal = useCallback(() => {
		if (!selectedMessageTxHash) return null

		return createPortal(
			<ConversationModal
				messageId={selectedMessageTxHash}
				onClose={() => setSelectedMessageTxHash(null)}
			/>,
			document.body
		)
	}, [selectedMessageTxHash])

	return (
		<div className='flex flex-col h-full '>
			<div className='px-4 pb-4'>
				<div className='flex items-center justify-end'>
					<div className='flex items-center space-x-3'>
						<span className='text-xs font-normal text-gray-700'>
							Show My Messages Only
						</span>
						<Switch
							checked={showOnlyUserMessages}
							onChange={handleToggleUserMessages}
							className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out ${
								showOnlyUserMessages ? 'bg-blue-600' : 'bg-gray-200'
							}`}
						>
							<span
								className={`${
									showOnlyUserMessages
										? 'translate-x-[18px] bg-white'
										: 'translate-x-[2px] bg-white'
								} inline-block h-4 w-4 transform rounded-full shadow-sm transition-transform duration-200 ease-in-out`}
							/>
						</Switch>
					</div>
				</div>
			</div>

			<div className='flex-1 overflow-y-auto scroll-smooth'>
				<div className='p-4 space-y-6'>
					{messages.map((message, index) => {
						const messageKey = index
						const isNew = message === messages[messages.length - 1]

						return isNew ? (
							<MessageAnimation key={`anim-${messageKey}`}>
								<ChatMessage
									message={message}
									onSelect={msg => {
										// setSelectedMessageTxHash(msg.tx_hash)
									}}
								/>
							</MessageAnimation>
						) : (
							<ChatMessage
								key={messageKey}
								message={message}
								onSelect={msg => {
									// setSelectedMessageTxHash(msg.tx_hash)
								}}
							/>
						)
					})}
					<div ref={messagesEndRef} className='h-1' />
				</div>
			</div>

			{!isGameEnded && (
				<div className='p-4'>
					<div className='max-w-4xl mx-auto relative'>
						{error && (
							<div className='w-full mb-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm'>
								{error}
							</div>
						)}
						<div className='flex gap-2 items-start justify-end'>
							<textarea
								value={prompt}
								onChange={e => {
									setPrompt(e.target.value)
									const target = e.target
									target.style.height = '40px'
									const newHeight = Math.min(target.scrollHeight, 200)
									target.style.height = `${newHeight}px`
									setTextareaHeight(newHeight)
								}}
								placeholder='Type a message...'
								disabled={status === 'pending'}
								className={`w-full px-6 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-[15px] transition-all duration-200 ease-in-out resize-none overflow-hidden leading-[40px] rounded-[24px] ${
									textareaHeight > 40
										? 'leading-normal py-2 !rounded-[12px]'
										: ''
								}`}
								style={{
									height: `${textareaHeight}px`,
									minHeight: '40px',
									maxHeight: '200px',
								}}
								onKeyDown={handleKeyDown}
								onInput={e => {
									const target = e.target as HTMLTextAreaElement
									target.style.height = '40px'
									const newHeight = Math.min(target.scrollHeight, 200)
									target.style.height = `${newHeight}px`
									setTextareaHeight(newHeight)
								}}
							/>
							<button
								onClick={handleSend}
								disabled={
									status === 'pending' ||
									msgPrice >= BigInt(balance?.value ?? 0)
								}
								className={`flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white p-2 h-10 w-10 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed ${
									textareaHeight > 40 ? 'rounded-xl' : 'rounded-full'
								}`}
							>
								{status === 'pending' ? (
									<svg
										className='animate-spin h-5 w-5'
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
									>
										<circle
											className='opacity-25'
											cx='12'
											cy='12'
											r='10'
											stroke='currentColor'
											strokeWidth='4'
										/>
										<path
											className='opacity-75'
											fill='currentColor'
											d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
										/>
									</svg>
								) : (
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'
										stroke='white'
										fill='none'
										className='w-5 h-5'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2.5}
											d='M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18'
										/>
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>
			)}

			{renderModal()}
		</div>
	)
}
