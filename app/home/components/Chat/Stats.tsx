import { cn } from '@/lib/utils'
import moment, { Duration } from 'moment'
import { useEffect, useState } from 'react'

interface StatsProps {
	totalParticipants: number
	totalMessages: number
	prizeFund: number
	endgameTime: string | undefined
	className?: string
	isGameEnded: boolean
}

export const Stats = ({
	totalParticipants,
	totalMessages,
	className,
	endgameTime,
	isGameEnded,
}: StatsProps) => {
	const [duration, setDuration] = useState<Duration | undefined>()

	useEffect(() => {
		const interval = setInterval(() => {
			const now = moment()
			const target = moment(endgameTime)
			const diff = target.diff(now)

			if (diff <= 0) {
				clearInterval(interval)
				setDuration(undefined)
			} else {
				const duration = moment.duration(diff)

				setDuration(duration)
			}
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	return (
		<div className={cn('px-0 lg:px-12', className)}>
			<div className='sticky top-8'>
				<div className='space-y-6'>
					<div className='bg-[#F2F2F2] p-6'>
						<div className='space-y-6'>
							<h3 className='font-[700] text-[20px] text-[#86868b] font-inter'>
								Stats
							</h3>
							<div>
								<h3 className='text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter'>
									Total Participants
								</h3>
								<p className='text-5xl font-[500] text-[#1F2024] font-inter'>
									{totalParticipants}
								</p>
							</div>
							<div>
								<h3 className='text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter'>
									Break Attempts
								</h3>
								<p className='text-5xl font-[500] text-[#1F2024] font-inter'>
									{totalMessages}
								</p>
							</div>
							{isGameEnded && (
								<div>
									<p className='text-5xl font-[500] text-[#1F2024] font-inter'>
										Game Ended
									</p>
								</div>
							)}
							<div>
								<h3 className='text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter'>
									Time Remaining
								</h3>
								<p className='text-5xl font-[500] text-[#1F2024] font-inter break-all'>
									{duration
										? `${
												duration.days() * 60 + duration.hours()
										  }:${duration.minutes()}:${duration.seconds()}`
										: "Time's up!"}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
