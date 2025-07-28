
import type { Token } from '../store/atoms'

// Популярные токены в Ethereum Mainnet (реальные адреса)
export const POPULAR_TOKENS: Token[] = [
  {
    address: '0x0000000000000000000000000000000000000000', // ETH (специальный)
    symbol: 'ETH',
    decimals: 18,
    name: 'Ethereum',
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // ✅ ПРАВИЛЬНЫЙ USDC
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin',
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // ✅ ПРАВИЛЬНЫЙ DAI
    symbol: 'DAI',
    decimals: 18,
    name: 'Dai Stablecoin',
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // ✅ ПРАВИЛЬНЫЙ USDT
    symbol: 'USDT',
    decimals: 6,
    name: 'Tether USD',
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // ✅ ПРАВИЛЬНЫЙ WBTC
    symbol: 'WBTC',
    decimals: 8,
    name: 'Wrapped BTC',
  }
]

// Функция для поиска токена по символу или адресу
export function findToken(identifier: string): Token | undefined {
  return POPULAR_TOKENS.find(
    token => 
      token.symbol.toLowerCase() === identifier.toLowerCase() ||
      token.address.toLowerCase() === identifier.toLowerCase()
  )
}

// Функция для проверки, является ли токен ETH
export function isNativeETH(tokenAddress: string): boolean {
  return tokenAddress === '0x0000000000000000000000000000000000000000'
}
// todo
// Адрес WETH (Wrapped ETH) - нужен для Uniswap
export const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

// Получить адрес для Uniswap (ETH -> WETH, остальные без изменений)
export function getTokenAddressForUniswap(tokenAddress: string): string {
  return isNativeETH(tokenAddress) ? WETH_ADDRESS : tokenAddress
}