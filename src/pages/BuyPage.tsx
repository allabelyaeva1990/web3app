// src/pages/BuyPage.tsx - Страница покупки токенов
import { useState, useCallback } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { useSetAtom } from 'jotai'
import { addNotificationAtom, addTransactionsHistoryAtom, updateTransactionsHistoryAtom } from '../store/atoms'
import { POPULAR_TOKENS } from '../constants/tokens'
import type { Token } from '../store/atoms'
import { Button, Card, InfoPanel, InfoRow, InputContainer, NumberInput, PageHeader, TokenSelector } from '../components'

export function BuyPage() {
  const { address } = useAccount()
  const addNotification = useSetAtom(addNotificationAtom)
  const addToHistory = useSetAtom(addTransactionsHistoryAtom)
  const updateHistory = useSetAtom(updateTransactionsHistoryAtom)

  // Состояние формы
  const [ethAmount, setEthAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState<Token>(POPULAR_TOKENS[1]) // USDC по умолчанию
  const [isLoading, setIsLoading] = useState(false)

  // Получаем баланс ETH
  const { data: ethBalance } = useBalance({
    address,
    query: { enabled: !!address }
  })

  // Простая логика расчета (в реальности - через API или оракул цен)
  const calculateTokenAmount = useCallback((ethAmount: string) => {
    if (!ethAmount || isNaN(Number(ethAmount))) return '0'
    
    // Моковые курсы (ETH = $2000)
    const ethPrice = 2000
    const tokenPrices: Record<string, number> = {
      'USDC': 1,
      'DAI': 1,
      'USDT': 1,
      'WBTC': 40000, // примерно 20x от ETH
    }
    
    const tokenPrice = tokenPrices[selectedToken.symbol] || 1
    const usdValue = Number(ethAmount) * ethPrice
    const tokenAmount = usdValue / tokenPrice
    
    return tokenAmount.toFixed(Math.min(6, selectedToken.decimals))
  }, [selectedToken])

  // Вычисляем количество токенов для покупки
  const tokenAmount = calculateTokenAmount(ethAmount)

  // Проверяем возможность покупки
  const canBuy = !!(
    address &&
    ethAmount &&
    Number(ethAmount) > 0 &&
    ethBalance &&
    Number(ethAmount) <= Number(ethBalance.formatted) &&
    !isLoading
  )

  // Функция покупки
  const handleBuy = useCallback(async () => {
    if (!canBuy) return

    setIsLoading(true)
    const id = Date.now().toString();
    try {
      addNotification({
        type: 'info',
        title: '💰 Покупка начата',
        message: `Покупаем ${tokenAmount} ${selectedToken.symbol} за ${ethAmount} ETH`,
        duration: 5000
      })
      // Добавляем в историю как покупку
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
        status: 'pending'
      })

      // Имитируем транзакцию
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      addNotification({
        type: 'success',
        title: '✅ Покупка успешна!',
        message: `Получено ${tokenAmount} ${selectedToken.symbol}`,
        duration: 10000
      })

      updateHistory({
        id,
        updates: {
          status: 'success'
        }
      })
      
      // Очищаем форму
      setEthAmount('')
      
    } catch (error) {
      addNotification({
        type: 'error',
        title: '❌ Ошибка покупки',
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
  }, [canBuy, ethAmount, tokenAmount, selectedToken, addNotification, addToHistory, updateHistory])

  // Функция для установки максимального количества ETH (с резервом на газ)
  const handleMaxClick = useCallback(() => {
    if (ethBalance) {
      const maxAmount = Math.max(0, Number(ethBalance.formatted) - 0.01)
      setEthAmount(maxAmount.toString())
    }
  }, [ethBalance])

  const formatETHBalance = () => {
    if (!address) return 'Не подключен'
    if (ethBalance) return `${Number(ethBalance.formatted).toFixed(4)} ETH`
    return '0.0000 ETH'
  }

  const getButtonText = () => {
    if (isLoading) return '⏳ Обработка покупки...'
    if (!address) return 'Подключите кошелек'
    if (!ethAmount || Number(ethAmount) === 0) return 'Введите сумму ETH'
    if (ethBalance && Number(ethAmount) > Number(ethBalance.formatted)) return '❌ Недостаточно ETH'
    return `💰 Купить ${selectedToken.symbol} за ${ethAmount} ETH`
  }

  return (
    <div>
      <PageHeader 
        title="Покупка токенов"
        subtitle="Купите токены за ETH по текущему курсу"
        icon="💰"
        gradient="linear-gradient(135deg, #28a745 0%, #20c997 100%)"
      />

      <Card>
        <InputContainer
          label="Платите (ETH)"
          balance={formatETHBalance()}
          onMaxClick={ethBalance && address ? handleMaxClick : undefined}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <NumberInput
              value={ethAmount}
              onChange={setEthAmount}
              placeholder="0.0"
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

        <InputContainer
          label="Получаете"
          balance={`Курс: 1 ETH = $${((Number(tokenAmount) / Number(ethAmount || 1)).toFixed(2))} ${selectedToken.symbol}`}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <NumberInput
              value={tokenAmount}
              onChange={() => {}} // read-only
              placeholder="0.0"
              disabled={true}
            />
            <TokenSelector 
              selectedToken={selectedToken}
              onTokenChange={setSelectedToken}
              label="Выберите токен для покупки"
              excludeToken={{
                address: '0x0000000000000000000000000000000000000000',
                symbol: 'ETH',
                decimals: 18,
                name: 'Ethereum'
              }}
            />
          </div>
        </InputContainer>

        {ethAmount && Number(ethAmount) > 0 && (
          <InfoPanel>
            <InfoRow label="Стоимость ETH" value="~$2,000" />
            <InfoRow label="Общая стоимость" value={`$${(Number(ethAmount) * 2000).toFixed(2)}`} />
            <InfoRow label="Комиссия сети" value="~0.005 ETH" />
          </InfoPanel>
        )}

        <Button
          variant="success"
          size="lg"
          fullWidth={true}
          disabled={!canBuy}
          loading={isLoading}
          onClick={handleBuy}
        >
          {getButtonText()}
        </Button>
      </Card>

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
          Вы отправляете ETH, получаете выбранные токены по текущему рыночному курсу.
          Курсы обновляются в реальном времени.
        </div>
      </div>
    </div>
  )
}