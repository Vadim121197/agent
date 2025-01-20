import { Address } from 'viem'
import { sepolia } from 'viem/chains'

export enum Addresses {
	ETH_PRICE_FEED,
	POOL,
	PAYMENT,
}

export const chainAddresses: Record<number, Record<Addresses, Address>> = {
	[sepolia.id]: {
		[Addresses.ETH_PRICE_FEED]: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
		[Addresses.POOL]: '0xE2E78001959aD45A785D168BdC38535602dAb225',
		[Addresses.PAYMENT]: '0xE2E78001959aD45A785D168BdC38535602dAb225',
	},
}
