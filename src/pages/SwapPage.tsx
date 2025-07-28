import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useAccount, useBalance } from 'wagmi' 
import { useTranslation } from 'react-i18next'
import { useMemo, useCallback } from 'react'
import { 
  inputAmountAtom, 
  outputAmountAtom, 
  inputTokenAtom, 
  outputTokenAtom,
  swapStateAtom,
  flipTokensAtom,
  addTransactionsHistoryAtom,
  addNotificationAtom,
  updateTransactionsHistoryAtom
} from '../store/atoms'
import type { Address } from 'viem'
import { useAppStore } from '../store/zustand-store'
import { Button, Card, FlipButton, InfoPanel, InfoRow, InputContainer, NumberInput, PageHeader, TokenSelector } from '../components'

export function SwapPage() {
  const { t } = useTranslation()
  const { address } = useAccount()
  
  // Состояние из атомов
  const [inputAmount, setInputAmount] = useAtom(inputAmountAtom)
  const [outputAmount, setOutputAmount] = useAtom(outputAmountAtom)
  const [inputToken, setInputToken] = useAtom(inputTokenAtom)
  const [outputToken, setOutputToken] = useAtom(outputTokenAtom)

  const { slippage, deadline } = useAppStore()
  
  const swapState = useAtomValue(swapStateAtom)
  const flipTokens = useSetAtom(flipTokensAtom)
  const addToHistory = useSetAtom(addTransactionsHistoryAtom)
  const updateHistory = useSetAtom(updateTransactionsHistoryAtom)
  const addNotification = useSetAtom(addNotificationAtom)
  
  // 🔧 ИСПРАВЛЕНИЕ: Используем useBalance напрямую с правильными условиями
  const isInputETH = inputToken.address === '0x0000000000000000000000000000000000000000'
  const isOutputETH = outputToken.address === '0x0000000000000000000000000000000000000000'
  
  console.log('🔍 Swap Debug:', {
    address,
    inputToken: inputToken.symbol,
    inputTokenAddress: inputToken.address,
    isInputETH,
    enabled: !!address
  })
  
  // Баланс входного токена
  const { 
    data: inputBalance, 
    isLoading: isInputBalanceLoading, 
    error: inputBalanceError 
  } = useBalance({
    address,
    token: isInputETH ? undefined : (inputToken.address as Address),
    query: {
      enabled: !!address, // Простое условие
      refetchInterval: 15 * 1000,
    }
  })

  const minimumReceived = useMemo(() => {
    if (!swapState.hasValidAmounts) return '0'
    const slippageMultiplier = 1 - slippage / 100
    return (Number(outputAmount) * slippageMultiplier).toFixed(6)
  }, [outputAmount, slippage, swapState.hasValidAmounts])
  
  // Баланс выходного токена
  const { 
    data: outputBalance, 
    isLoading: isOutputBalanceLoading 
  } = useBalance({
    address,
    token: isOutputETH ? undefined : (outputToken.address as Address),
    query: {
      enabled: !!address,
      refetchInterval: 15 * 1000,
    }
  })
  
  console.log('🔍 Balance Results:', {
    inputBalance: inputBalance?.formatted,
    inputSymbol: inputBalance?.symbol,
    isInputBalanceLoading,
    inputBalanceError,
    outputBalance: outputBalance?.formatted,
    outputSymbol: outputBalance?.symbol,
  })

  // Мемоизированные вычисления
  const hasInsufficientBalance = useMemo(() => {
    if (!inputBalance || !inputAmount) return false
    return Number(inputAmount) > Number(inputBalance.formatted)
  }, [inputBalance, inputAmount])

  const canSwap = useMemo(() => {
    return !!(
      address && 
      swapState.canSwap &&
      !hasInsufficientBalance && 
      !isInputBalanceLoading
    )
  }, [address, swapState.canSwap, hasInsufficientBalance, isInputBalanceLoading])

  // Обработчики
  const handleInputChange = useCallback((value: string) => {
    const cleanValue = value.replace(/[^0-9.]/g, '')
    setInputAmount(cleanValue)
    
    // Простая логика расчета
    if (cleanValue && !isNaN(Number(cleanValue))) {
      const mockRate = inputToken.symbol === 'ETH' ? 2000 : 0.0005
      const estimated = (Number(cleanValue) * mockRate).toFixed(
        Math.min(6, outputToken.decimals)
      )
      setOutputAmount(estimated)
    } else {
      setOutputAmount('')
    }
  }, [setInputAmount, setOutputAmount, inputToken.symbol, outputToken.decimals])

  const handleMaxClick = useCallback(() => {
    if (inputBalance) {
      const maxAmount = isInputETH
        ? Math.max(0, Number(inputBalance.formatted) - 0.01) // Оставляем на газ
        : Number(inputBalance.formatted)
      handleInputChange(maxAmount.toString())
    }
  }, [inputBalance, isInputETH, handleInputChange])

  const handleSwap = useCallback(async () => {
    if (!canSwap) return
    const id = Date.now().toString();
    try {
      addNotification({
        type: 'info',
        title: 'Своп начат',
        message: `Обмениваем ${inputAmount} ${inputToken.symbol} на ${outputAmount} ${outputToken.symbol}`,
        duration: 5000
      })

      addToHistory({
        id,
        inputToken,
        outputToken,
        inputAmount,
        outputAmount,
        status: 'pending'
      })

      console.log('🔄 Executing swap:', {
        from: `${inputAmount} ${inputToken.symbol}`,
        to: `${outputAmount} ${outputToken.symbol}`,
        user: address,
      })
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      addNotification({
        type: 'success',
        title: '✅ Своп выполнен успешно!',
        message: `Получено ${outputAmount} ${outputToken.symbol}`,
        duration: 10000
      })

      updateHistory({
        id,
        updates: {
          status: 'success'
        }
      })
      
      setInputAmount('')
      setOutputAmount('')
      
    } catch (error) {
      console.error('Swap failed:', error)
      
      addNotification({
        type: 'error',
        title: '❌ Ошибка свопа',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка',
        duration: 10000
      })
    }
  }, [
    canSwap, 
    addNotification, 
    addToHistory, 
    updateHistory,
    inputToken, 
    outputToken, 
    inputAmount, 
    outputAmount, 
    address,
    setInputAmount,
    setOutputAmount
  ])

  const getButtonText = () => {
    if (!address) return 'Подключите кошелек'
    if (hasInsufficientBalance) return '❌ Недостаточно средств'
    if (!swapState.hasValidAmounts) return 'Введите сумму'
    if (inputToken.address === outputToken.address) return '⚠️ Выберите разные токены'
    return `🔄 Обменять ${inputToken.symbol} → ${outputToken.symbol}`
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatBalance = (balance: any, loading: boolean) => {
    if (!address) return 'Не подключен'
    if (loading) return '⏳ Загрузка...'
    if (balance) return `${Number(balance.formatted).toFixed(4)} ${balance.symbol}`
    return '0.0000'
  }

  return (
    <div>
      <PageHeader 
        title={t('swap')}
        subtitle="Обменивайте токены по лучшему курсу"
        icon="🔄"
      />

      <Card>
        <InputContainer
          label="Продаете"
          balance={formatBalance(inputBalance, isInputBalanceLoading)}
          onMaxClick={inputBalance && address ? handleMaxClick : undefined}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <NumberInput
              value={inputAmount}
              onChange={handleInputChange}
              placeholder="0.0"
            />
            <TokenSelector 
              selectedToken={inputToken}
              onTokenChange={setInputToken}
              label="Выберите токен для продажи"
              excludeToken={outputToken}
            />
          </div>
        </InputContainer>

        <FlipButton onClick={() => flipTokens()} />
        <InputContainer
          label="Получаете"
          balance={formatBalance(outputBalance, false)}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <NumberInput
              value={outputAmount}
              onChange={() => {}} // read-only
              placeholder="0.0"
              disabled={true}
            />
            <TokenSelector 
              selectedToken={outputToken}
              onTokenChange={setOutputToken}
              label="Выберите токен для покупки"
              excludeToken={inputToken}
            />
          </div>
        </InputContainer>
        {swapState.hasValidAmounts && (
          <InfoPanel>
            <InfoRow 
              label="Курс обмена"
              value={`1 ${inputToken.symbol} = ${swapState.exchangeRate.toFixed(6)} ${outputToken.symbol}`}
            />
            <InfoRow 
              label="Slippage"
              value={`${slippage}%`}
            />
            <InfoRow 
              label="Deadline"
              value={`${deadline} мин`}
            />
            <InfoRow 
              label="Минимум получите"
              value={`${minimumReceived} ${outputToken.symbol}`}
              highlight={true}
            />
          </InfoPanel>
        )}
        <Button
          variant="primary"
          size="lg"
          fullWidth={true}
          disabled={!canSwap}
          onClick={handleSwap}
        >
          {getButtonText()}
        </Button>
      </Card>
    </div>
  )
}