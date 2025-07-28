// src/pages/SellPage.tsx - Страница продажи токенов
import { useState, useCallback } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { useSetAtom } from 'jotai'
import { addNotificationAtom, addTransactionsHistoryAtom, updateTransactionsHistoryAtom } from '../store/atoms'
import { POPULAR_TOKENS } from '../constants/tokens'
import type { Token } from '../store/atoms'
import type { Address } from 'viem'
import { Button, Card, InfoPanel, InfoRow, InputContainer, NumberInput, PageHeader, TokenSelector } from '../components'

export function SellPage() {
  const { address } = useAccount()
  const addNotification = useSetAtom(addNotificationAtom)
  const addToHistory = useSetAtom(addTransactionsHistoryAtom)
  const updateHistory = useSetAtom(updateTransactionsHistoryAtom)

  // Состояние формы
  const [tokenAmount, setTokenAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState<Token>(POPULAR_TOKENS[1]) // USDC по умолчанию
  const [isLoading, setIsLoading] = useState(false)

  // Определяем, является ли выбранный токен ETH
  const isSelectedTokenETH = selectedToken.address === '0x0000000000000000000000000000000000000000'

  // Получаем баланс выбранного токена
  const { data: tokenBalance } = useBalance({
    address,
    token: isSelectedTokenETH ? undefined : (selectedToken.address as Address),
    query: { enabled: !!address }
  })

  // Простая логика расчета ETH (в реальности - через API или оракул цен)
  const calculateETHAmount = useCallback((tokenAmount: string) => {
    if (!tokenAmount || isNaN(Number(tokenAmount))) return '0'
    
    // Моковые курсы (ETH = $2000)
    const ethPrice = 2000
    const tokenPrices: Record<string, number> = {
      'ETH': 2000,
      'USDC': 1,
      'DAI': 1,
      'USDT': 1,
      'WBTC': 40000,
    }
    
    const tokenPrice = tokenPrices[selectedToken.symbol] || 1
    const usdValue = Number(tokenAmount) * tokenPrice
    const ethAmount = usdValue / ethPrice
    
    return ethAmount.toFixed(6)
  }, [selectedToken])

  // Вычисляем количество ETH для получения
  const ethAmount = calculateETHAmount(tokenAmount)

  // Проверяем возможность продажи
  const canSell = !!(
    address &&
    tokenAmount &&
    Number(tokenAmount) > 0 &&
    tokenBalance &&
    Number(tokenAmount) <= Number(tokenBalance.formatted) &&
    !isLoading
  )

  // Функция продажи
  const handleSell = useCallback(async () => {
    if (!canSell) return
    const id = Date.now().toString();
    setIsLoading(true)
    
    try {
      addNotification({
        type: 'info',
        title: '💸 Продажа начата',
        message: `Продаем ${tokenAmount} ${selectedToken.symbol} за ${ethAmount} ETH`,
        duration: 5000
      })

      // Добавляем в историю как продажу
      addToHistory({
        id,
        inputToken: selectedToken,
        outputToken: {
          address: '0x0000000000000000000000000000000000000000',
          symbol: 'ETH',
          decimals: 18,
          name: 'Ethereum'
        },
        inputAmount: tokenAmount,
        outputAmount: ethAmount,
        status: 'pending'
      })

      // Имитируем транзакцию
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      addNotification({
        type: 'success',
        title: '✅ Продажа успешна!',
        message: `Получено ${ethAmount} ETH`,
        duration: 10000
      })

      updateHistory({
        id,
        updates: {
          status: 'success'
        }
      })
      
      // Очищаем форму
      setTokenAmount('')
      
    } catch (error) {
      addNotification({
        type: 'error',
        title: '❌ Ошибка продажи',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка',
        duration: 10000
      })
      addToHistory({
        id,
        inputToken: {
          address: '0x0000000000000000000000000000000000000000',
          symbol: 'ETH',
          decimals: 18,
          name: 'Ethereum'
        },
        outputToken: selectedToken,
        inputAmount: ethAmount,
        outputAmount: tokenAmount,
        status: 'failed'
      })
    } finally {
      setIsLoading(false)
    }
  }, [canSell, tokenAmount, ethAmount, selectedToken, addNotification, addToHistory, updateHistory])

  const handleMaxClick = useCallback(() => {
    if (tokenBalance) {
      const maxAmount = isSelectedTokenETH 
        ? Math.max(0, Number(tokenBalance.formatted) - 0.01) // Резерв на газ для ETH
        : Number(tokenBalance.formatted)
      setTokenAmount(maxAmount.toString())
    }
  }, [tokenBalance, isSelectedTokenETH])
const formatTokenBalance = () => {
    if (!address) return 'Не подключен'
    if (tokenBalance) return `${Number(tokenBalance.formatted).toFixed(4)} ${tokenBalance.symbol}`
    return `0.0000 ${selectedToken.symbol}`
  }

  const getButtonText = () => {
    if (isLoading) return '⏳ Обработка продажи...'
    if (!address) return 'Подключите кошелек'
    if (!tokenAmount || Number(tokenAmount) === 0) return 'Введите количество токенов'
    if (tokenBalance && Number(tokenAmount) > Number(tokenBalance.formatted)) return `❌ Недостаточно ${selectedToken.symbol}`
    return `💸 Продать ${selectedToken.symbol} за ${ethAmount} ETH`
  }

  const getTokenPrice = () => {
    const prices: Record<string, number> = {
      'ETH': 2000, 'USDC': 1, 'DAI': 1, 'USDT': 1, 'WBTC': 40000
    }
    return prices[selectedToken.symbol] || 1
  }
  return (
    <div>
      <PageHeader 
        title="Продажа токенов"
        subtitle="Продайте токены и получите ETH по текущему курсу"
        icon="💸"
        gradient="linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)"
      />

      <Card>
        <InputContainer
          label="Продаете"
          balance={formatTokenBalance()}
          onMaxClick={tokenBalance && address ? handleMaxClick : undefined}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <NumberInput
              value={tokenAmount}
              onChange={setTokenAmount}
              placeholder="0.0"
            />
            <TokenSelector 
              selectedToken={selectedToken}
              onTokenChange={setSelectedToken}
              label="Выберите токен для продажи"
            />
          </div>
        </InputContainer>

        {/* ✅ Стрелка вниз */}
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#f8f9fa',
            border: '2px solid #e1e5e9',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            ↓
          </div>
        </div>

        {/* ✅ Блок получения ETH */}
        <InputContainer
          label="Получаете (ETH)"
          balance={`Курс: 1 ${selectedToken.symbol} = $${((Number(ethAmount) * 2000) / Number(tokenAmount || 1)).toFixed(6)} ETH`}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <NumberInput
              value={ethAmount}
              onChange={() => {}} // read-only
              placeholder="0.0"
              disabled={true}
            />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#1976d2'
            }}>
              <span>ETH</span>
            </div>
          </div>
        </InputContainer>

        {/* ✅ Информация о сделке */}
        {tokenAmount && Number(tokenAmount) > 0 && (
          <InfoPanel>
            <InfoRow label={`Цена ${selectedToken.symbol}`} value={`$${getTokenPrice()}`} />
            <InfoRow label="Общая стоимость" value={`$${(Number(ethAmount) * 2000).toFixed(2)}`} />
            <InfoRow label="Комиссия сети" value="~0.005 ETH" />
          </InfoPanel>
        )}

        {/* ✅ Кнопка продажи */}
        <Button
          variant="danger"
          size="lg"
          fullWidth={true}
          disabled={!canSell}
          loading={isLoading}
          onClick={handleSell}
        >
          {getButtonText()}
        </Button>
      </Card>

      {/* ✅ Дополнительная информация */}
      <div style={{ 
        marginTop: '20px', 
        fontSize: '12px', 
        color: '#999', 
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        padding: '16px',
        borderRadius: '12px'
      }}>
        <div style={{ marginBottom: '8px' }}>
          💡 <strong>Как это работает:</strong>
        </div>
        <div>
          Вы отправляете токены, получаете ETH по текущему рыночному курсу.
          Курсы обновляются в реальном времени.
        </div>
      </div>
    </div>
  )
}