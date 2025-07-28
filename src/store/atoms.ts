// store/atoms.ts
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// Типы для токенов
export interface Token {
  address: string
  symbol: string
  decimals: number
  name: string
  logoURI?: string
}

// Базовые атомы настроек (сохраняются в localStorage)
export const slippageAtom = atomWithStorage('slippage', 0.5)
export const deadlineAtom = atomWithStorage('deadline', 20) // минуты

// Атомы для текущего свопа (не сохраняются)
export const inputAmountAtom = atom('')
export const outputAmountAtom = atom('')

// Атомы для выбранных токенов (сохраняются в localStorage)
export const inputTokenAtom = atomWithStorage<Token>('inputToken', {
  address: '0x0000000000000000000000000000000000000000',
  symbol: 'ETH',
  decimals: 18,
  name: 'Ethereum'
})

export const outputTokenAtom = atomWithStorage<Token>('outputToken', {
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 
  symbol: 'USDC',
  decimals: 6,
  name: 'USD Coin'
})

// Вычисляемый атом для состояния свопа
export const swapStateAtom = atom((get) => {
  const inputAmount = get(inputAmountAtom)
  const outputAmount = get(outputAmountAtom)
  const slippage = get(slippageAtom)
  const inputToken = get(inputTokenAtom)
  const outputToken = get(outputTokenAtom)
  
  return {
    inputAmount,
    outputAmount,
    slippage,
    inputToken,
    outputToken,
    // Вычисляемые значения
    hasValidAmounts: inputAmount !== '' && outputAmount !== '' && Number(inputAmount) > 0,
    canSwap: inputAmount !== '' && outputAmount !== '' && inputToken.address !== outputToken.address,
    exchangeRate: inputAmount && outputAmount ? Number(outputAmount) / Number(inputAmount) : 0,
  }
})

// Атом для смены токенов местами (write-only)
export const flipTokensAtom = atom(
  null, // read функция (атом только для записи)
  (get, set) => {
    const inputToken = get(inputTokenAtom)
    const outputToken = get(outputTokenAtom)
    const inputAmount = get(inputAmountAtom)
    const outputAmount = get(outputAmountAtom)
    
    // Меняем токены местами
    set(inputTokenAtom, outputToken)
    set(outputTokenAtom, inputToken)
    
    // Меняем суммы местами
    set(inputAmountAtom, outputAmount)
    set(outputAmountAtom, inputAmount)
  }
)

// Атом для истории свопов
export interface TransationsHistory {
  id: string
  operationType: 'swap' | 'buy' | 'sell'
  timestamp: number
  inputToken: Token
  outputToken: Token
  inputAmount: string
  outputAmount: string
  txHash?: string
  status: 'pending' | 'success' | 'failed'
  gasUsed?: string
  gasPrice?: string
}

export const transactionsHistoryAtom = atomWithStorage<TransationsHistory[]>('transactionsHistory', [])

export const addTransactionsHistoryAtom = atom(
  null,
  (get, set, newSwap: Omit<TransationsHistory, 'timestamp'>) => {
    const currentHistory = get(transactionsHistoryAtom)
    const swapWithMeta: TransationsHistory = {
      ...newSwap,
      timestamp: Date.now(),
    }
    
    set(transactionsHistoryAtom, [swapWithMeta, ...currentHistory.slice(0, 99)])
  }
)

export const updateTransactionsHistoryAtom = atom(
  null,
  (get, set, { id, updates }: { id: string, updates: Partial<TransationsHistory> }) => {
    const currentHistory = get(transactionsHistoryAtom)
    const updatedHistory = currentHistory.map(swap => 
      swap.id === id ? { ...swap, ...updates } : swap
    )
    set(transactionsHistoryAtom, updatedHistory)
  }
)

// Атом для настроек интерфейса
export interface UISettings {
  darkMode: boolean
  language: 'en' | 'ru'
  showAdvanced: boolean
  soundEnabled: boolean
}

export const uiSettingsAtom = atomWithStorage<UISettings>('uiSettings', {
  darkMode: false,
  language: 'en',
  showAdvanced: false,
  soundEnabled: true,
})

// Атом для уведомлений
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: number
  duration?: number // мс, undefined = не скрывать
}

export const notificationsAtom = atom<Notification[]>([])

export const addNotificationAtom = atom(
  null,
  (get, set, notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const currentNotifications = get(notificationsAtom)
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
    }
    
    set(notificationsAtom, [...currentNotifications, newNotification])
    if (notification.duration) {
      setTimeout(() => {
        set(notificationsAtom, (prev) => 
          prev.filter(n => n.id !== newNotification.id)
        )
      }, notification.duration)
    }
  }
)

export const removeNotificationAtom = atom(
  null,
  (get, set, id: string) => {
    set(notificationsAtom, (prev) => prev.filter(n => n.id !== id))
  }
)