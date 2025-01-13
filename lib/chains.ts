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
		[Addresses.POOL]: '0x816a81fb3E083fD85d8ae4fd2e7Fe381a4883d87',
		[Addresses.PAYMENT]: '0xe2ed2a7bee11e2c936b7999913e3866d4cfc4f8e',
	},
}
