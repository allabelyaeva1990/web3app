import { useCallback, useMemo } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { 
  inputAmountAtom, 
  outputAmountAtom, 
  inputTokenAtom, 
  outputTokenAtom,
  swapStateAtom,
  flipTokensAtom,
  addTransactionsHistoryAtom,
  type Token, 
  updateTransactionsHistoryAtom
} from '../store/atoms'
import { useAppStore } from '../store/zustand-store'
import { useNotifications } from './useNotifications'
import { useTokenBalance } from './useTokenBalance'
import { PriceService } from '../services'

export function useSwapOperations() {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { slippage, deadline } = useAppStore()
  const { showSuccess, showError, showInfo } = useNotifications()
  
  // Состояние атомов
  const [inputAmount, setInputAmount] = useAtom(inputAmountAtom)
  const [outputAmount, setOutputAmount] = useAtom(outputAmountAtom)
  const [inputToken, setInputToken] = useAtom(inputTokenAtom)
  const [outputToken, setOutputToken] = useAtom(outputTokenAtom)
  
  const swapState = useAtomValue(swapStateAtom)
  const flipTokens = useSetAtom(flipTokensAtom)
  const addToHistory = useSetAtom(addTransactionsHistoryAtom)
  const updateTransaction = useSetAtom(updateTransactionsHistoryAtom)
  
  // 💰 Балансы токенов
  const inputBalance = useTokenBalance(inputToken)
  const outputBalance = useTokenBalance(outputToken)
  
  // Недостаточно средств
  const hasInsufficientBalance = useMemo(() => {
    if (!inputBalance.data || !inputAmount) return false
    return Number(inputAmount) > Number(inputBalance.formatted)
  }, [inputBalance.data, inputBalance.formatted, inputAmount])

  // Минимальная сумма к получению с учетом slippage
  const minimumReceived = useMemo(() => {
    if (!swapState.hasValidAmounts) return '0'
    const slippageMultiplier = 1 - slippage / 100
    return (Number(outputAmount) * slippageMultiplier).toFixed(6)
  }, [outputAmount, slippage, swapState.hasValidAmounts])

  // Можно ли делать своп
  const canSwap = useMemo(() => {
    return !!(
      address && 
      swapState.canSwap &&
      !hasInsufficientBalance && 
      !inputBalance.isLoading
    )
  }, [address, swapState.canSwap, hasInsufficientBalance, inputBalance.isLoading])

  // ЛОГИКА РАСЧЕТОВ
  
  const calculateExchangeRate = useCallback(async(
    inputToken: Token,
    outputToken: Token,
    inputAmount: string
  ) => {
    if (!inputAmount || isNaN(Number(inputAmount))) return '0'
    
    try {
      // Получаем реальные цены через наш сервис
      return await PriceService.calculateExchangeRate(
        inputToken.symbol,
        outputToken.symbol,
        inputAmount
      )
    } catch (error) {
      console.error('Ошибка расчета курса:', error)
      return '0'
    }
  }, [])

  // ОБРАБОТЧИКИ
  
  // Изменение входной суммы
  const handleInputChange = useCallback(async(value: string) => {
    // Очищаем ввод
    const cleanValue = value.replace(/[^0-9.]/g, '')
    const parts = cleanValue.split('.')
    const sanitizedValue = parts.length > 2 
      ? `${parts[0]}.${parts.slice(1).join('')}` 
      : cleanValue
    
    setInputAmount(sanitizedValue)
    
    // Пересчитываем выходную сумму
    if (sanitizedValue && !isNaN(Number(sanitizedValue))) {
      const outputValue = await calculateExchangeRate(inputToken, outputToken, sanitizedValue)
      setOutputAmount(outputValue)
    } else {
      setOutputAmount('')
    }
  }, [setInputAmount, setOutputAmount, calculateExchangeRate, inputToken, outputToken])

  // Установка максимальной суммы
  const handleMaxClick = useCallback(() => {
    if (!inputBalance.data) return
    
    const isInputETH = inputToken.address === '0x0000000000000000000000000000000000000000'
    const maxAmount = isInputETH
      ? Math.max(0, Number(inputBalance.formatted) - 0.01) // Резерв на газ
      : Number(inputBalance.formatted)
    
    handleInputChange(maxAmount.toString())
  }, [inputBalance.data, inputBalance.formatted, inputToken.address, handleInputChange])

  // ОПЕРАЦИИ
  
  // Универсальная функция выполнения операции
  const executeOperation = useCallback(async (
    operationType: 'swap' | 'buy' | 'sell',
    inputToken: Token,
    outputToken: Token,
    inputAmount: string,
    outputAmount: string
  ) => {
    try {
      // Начинаем операцию
      const operationNames = {
        swap: t('swapStarted'),
        buy: t('buyStarted'),
        sell: t('sellStarted')
      }
      
      showInfo(
        operationNames[operationType],
        t('swapping', {
          inputAmount,
          inputToken: inputToken.symbol,
          outputAmount,
          outputToken: outputToken.symbol
        })
      )
      const transactionId = `${operationType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      // Добавляем в историю
      addToHistory({
        id: transactionId,
        operationType,
        inputToken,
        outputToken,
        inputAmount,
        outputAmount,
        status: 'pending'
      })

      // Имитируем выполнение (в реальности - вызов контракта)
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000))
      
      if (Math.random() > 0.1) {
        // Обновляем статус на успех
        if (transactionId) {
          updateTransaction({
            id: transactionId,
            updates: { 
              status: 'success',
              txHash: `0x${Math.random().toString(16).substr(2, 64)}`
            }
          })
        }
        
        const successNames = {
          swap: t('swapSuccess'),
          buy: t('buySuccess'),
          sell: t('sellSuccess')
        }
        
        showSuccess(
          successNames[operationType],
          t('received', { amount: outputAmount, token: outputToken.symbol })
        )
        
        // Очищаем форму
        setInputAmount('')
        setOutputAmount('')
        
        return true
      } else {
        throw new Error('Транзакция отклонена сетью')
      }
      
    } catch (error) {
      const errorNames = {
        swap: t('swapError'),
        buy: t('buyError'),
        sell: t('sellError')
      }
      
      showError(
        errorNames[operationType],
        error instanceof Error ? error.message : t('unknownError')
      )
      
      throw error
    }
  }, [t, showInfo, showSuccess, showError, addToHistory, updateTransaction, setInputAmount, setOutputAmount])

  // Своп
  const handleSwap = useCallback(async () => {
    if (!canSwap) return
    return executeOperation('swap', inputToken, outputToken, inputAmount, outputAmount)
  }, [canSwap, executeOperation, inputToken, outputToken, inputAmount, outputAmount])

  // Покупка (ETH → Token)
  const handleBuy = useCallback(async (ethAmount: string, selectedToken: Token) => {
    const tokenAmount = await calculateExchangeRate(
      { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18, name: 'Ethereum' },
      selectedToken,
      ethAmount
    )
    
    return executeOperation(
      'buy',
      { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18, name: 'Ethereum' },
      selectedToken,
      ethAmount,
      tokenAmount
    )
  }, [calculateExchangeRate, executeOperation])

  // Продажа (Token → ETH)
  const handleSell = useCallback(async (tokenAmount: string, selectedToken: Token) => {
    const ethAmount = await calculateExchangeRate(
      selectedToken,
      { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18, name: 'Ethereum' },
      tokenAmount
    )
    
    return executeOperation(
      'sell',
      selectedToken,
      { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18, name: 'Ethereum' },
      tokenAmount,
      ethAmount
    )
  }, [calculateExchangeRate, executeOperation])

  // Текст для кнопки
  const getSwapButtonText = useMemo(() => {
    if (!address) return t('connectWallet')
    if (hasInsufficientBalance) return t('insufficientBalance')
    if (!swapState.hasValidAmounts) return t('enterAmount')
    if (inputToken.address === outputToken.address) return t('selectDifferentTokens')
    return `🔄 ${t('swapTokens')} ${inputToken.symbol} → ${outputToken.symbol}`
  }, [address, hasInsufficientBalance, swapState.hasValidAmounts, inputToken, outputToken, t])

  // Смена токенов местами
  const handleFlipTokens = useCallback(() => {
    flipTokens()
  }, [flipTokens])

  //Информация о свопе
  const swapInfo = useMemo(() => ({
    exchangeRate: swapState.exchangeRate,
    slippage,
    deadline,
    minimumReceived,
    hasValidAmounts: swapState.hasValidAmounts,
    canSwap,
    gasEstimate: '~0.005 ETH', // Mock
    priceImpact: swapState.hasValidAmounts && Number(inputAmount) > 1000 ? '0.1%' : '< 0.01%'
  }), [swapState.exchangeRate, swapState.hasValidAmounts, slippage, deadline, minimumReceived, canSwap, inputAmount])

  return {
    // Состояние
    inputAmount,
    outputAmount,
    inputToken,
    outputToken,
    inputBalance,
    outputBalance,
    swapState,
    swapInfo,
    canSwap,
    hasInsufficientBalance,
    
    // Обработчики
    handleInputChange,
    handleMaxClick,
    handleSwap,
    handleBuy,
    handleSell,
    handleFlipTokens,
    
    // 🔧 Сеттеры
    setInputToken,
    setOutputToken,
    
    // Утилиты
    calculateExchangeRate,
    getSwapButtonText,
    
    // 📏 Форматтеры
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatBalance: (balance: any, isLoading: boolean) => {
      if (!address) return 'Не подключен'
      if (isLoading) return '⏳ Загрузка...'
      if (balance) return `${Number(balance.formatted).toFixed(4)} ${balance.symbol}`
      return '0.0000'
    }
  }
}
