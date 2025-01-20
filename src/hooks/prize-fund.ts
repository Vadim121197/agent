import { Addresses, chainAddresses } from '@/src/lib/chains'
import { useEffect, useMemo } from 'react'
import { formatUnits } from 'viem'
import { useBalance, useChainId, useReadContracts } from 'wagmi'

const abi = [
	{
		inputs: [],
		name: 'latestAnswer',
		outputs: [{ internalType: 'int256', name: '', type: 'int256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'decimals',
		outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
		stateMutability: 'view',
		type: 'function',
	},
] as const

export const usePrizeFund = () => {
	const chainId = useChainId()
	const { data: priceFeed, refetch: refetchContractData } = useReadContracts({
		contracts: [
			{
				abi,
				address: chainAddresses[chainId][Addresses.ETH_PRICE_FEED],
				functionName: 'latestAnswer',
			},
			{
				abi,
				address: chainAddresses[chainId][Addresses.ETH_PRICE_FEED],
				functionName: 'decimals',
			},
		],
	})

	const { data: balance, refetch: refetchBalance } = useBalance({
		address: chainAddresses[chainId][Addresses.POOL],
	})

	useEffect(() => {
		const interval = setInterval(() => {
			refetchContractData()
			refetchBalance()
		}, 10000)
		return () => {
			clearInterval(interval)
		}
	}, [])

	const prize = useMemo(() => {
		return (
			Number(
				formatUnits(
					priceFeed?.[0].result ?? BigInt(0),
					priceFeed?.[1].result ?? 1
				)
			) *
			Number(formatUnits(balance?.value ?? BigInt(0), balance?.decimals ?? 1))
		)
	}, [balance, priceFeed])

	return prize
}
