// src/utils/web3.ts - Утилиты для работы с Web3
import { formatUnits, parseUnits } from 'viem'

/**
 * Форматирует адрес для отображения (сокращенный вид)
 */
export function formatAddress(address: string, startLength = 6, endLength = 4): string {
  if (!address || address.length < startLength + endLength) {
    return address
  }
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * Форматирует баланс токена для отображения
 */
export function formatTokenBalance(
  balance: bigint | string, 
  decimals: number, 
  precision = 4
): string {
  try {
    const balanceInUnits = formatUnits(BigInt(balance), decimals)
    const num = Number(balanceInUnits)
    
    if (num === 0) return '0'
    if (num < 0.0001) return '<0.0001'
    
    return num.toFixed(precision)
  } catch {
    return '0'
  }
}

/**
 * Парсит сумму токена из строки в bigint
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
  try {
    if (!amount || amount === '') return BigInt(0)
    return parseUnits(amount, decimals)
  } catch {
    return BigInt(0)
  }
}

/**
 * Проверяет, является ли строка валидным адресом Ethereum
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Конвертирует адрес в checksum формат
 */
export function toChecksumAddress(address: string): string {
  try {
    // Простая реализация checksum (в реальном проекте лучше использовать библиотеку)
    const addr = address.toLowerCase().replace('0x', '')
    const hash = Array.from(addr).map((char, index) => {
      // Простой алгоритм для демонстрации
      return index % 2 === 0 ? char.toUpperCase() : char
    }).join('')
    
    return `0x${hash}`
  } catch {
    return address
  }
}

/**
 * Получает название сети по chain ID
 */
export function getNetworkName(chainId: number): string {
  const networks: Record<number, string> = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    11155111: 'Sepolia Testnet',
    137: 'Polygon',
    56: 'BSC',
    31337: 'Local Hardhat'
  }
  
  return networks[chainId] || `Unknown Network (${chainId})`
}

/**
 * Форматирует Gas fee для отображения
 */
export function formatGasFee(gasUsed: bigint, gasPrice: bigint): string {
  try {
    const fee = gasUsed * gasPrice
    const feeInEth = formatUnits(fee, 18)
    const num = Number(feeInEth)
    
    if (num < 0.000001) return '<0.000001 ETH'
    return `${num.toFixed(6)} ETH`
  } catch {
    return 'Unknown'
  }
}

/**
 * Добавляет задержку (для имитации транзакций)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Генерирует случайный hash транзакции (для демонстрации)
 */
export function generateMockTxHash(): string {
  const chars = '0123456789abcdef'
  let hash = '0x'
  
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)]
  }
  
  return hash
}

/**
 * Получает URL эксплорера для транзакции
 */
export function getExplorerUrl(txHash: string, chainId: number): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    5: 'https://goerli.etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    137: 'https://polygonscan.com',
    56: 'https://bscscan.com'
  }
  
  const baseUrl = explorers[chainId] || 'https://etherscan.io'
  return `${baseUrl}/tx/${txHash}`
}

/**
 * Вычисляет процент проскальзывания
 */
export function calculateSlippage(
  expectedAmount: string, 
  actualAmount: string
): number {
  try {
    const expected = Number(expectedAmount)
    const actual = Number(actualAmount)
    
    if (expected === 0) return 0
    
    const slippage = ((expected - actual) / expected) * 100
    return Math.abs(slippage)
  } catch {
    return 0
  }
}

/**
 * Проверяет, достаточно ли баланса для транзакции
 */
export function hasInsufficientBalance(
  amount: string, 
  balance: string, 
  reserveForGas = '0'
): boolean {
  try {
    const amountNum = Number(amount)
    const balanceNum = Number(balance)
    const reserveNum = Number(reserveForGas)
    
    return amountNum > (balanceNum - reserveNum)
  } catch {
    return true
  }
}

/**
 * Форматирует время для отображения
 */
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days > 0) return `${days}д назад`
  if (hours > 0) return `${hours}ч назад`
  if (minutes > 0) return `${minutes}м назад`
  
  return 'Только что'
}