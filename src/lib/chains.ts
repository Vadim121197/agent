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
		[Addresses.POOL]: '0x0388252Fa20de58E2C6CE927187185082AC002E9',
		[Addresses.PAYMENT]: '0x0388252Fa20de58E2C6CE927187185082AC002E9',
	},
}
