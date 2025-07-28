import React, { useState, useCallback } from 'react'
import { TokenSelector } from '../components/TokenSelector'
import { POPULAR_TOKENS } from '../constants/tokens'
import { 
  Card, 
  Button, 
  InputContainer, 
  NumberInput, 
  InfoPanel, 
  InfoRow,
  PageHeader 
} from '../components/ui'
import { 
  useSwapOperations,
  useWeb3Connection,
  useAppLocalization,
  useTokenBalance
} from '../hooks'
import type { Token } from '../store/atoms'

export const SellPage = React.memo(function SellPage() {
  const { t } = useAppLocalization()
  const { isConnected } = useWeb3Connection()  
  
  // Используем хук операций для логики продажи
  const { handleSell, calculateExchangeRate } = useSwapOperations()
  
  // Локальное состояние страницы
  const [tokenAmount, setTokenAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState<Token>(POPULAR_TOKENS[1]) // USDC по умолчанию
  const [isLoading, setIsLoading] = useState(false)

  // Баланс выбранного токена 
  const tokenBalance = useTokenBalance(selectedToken)

  // Расчет количества ETH 
  const ethAmount = calculateExchangeRate(
    selectedToken,
    { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18, name: 'Ethereum' },
    tokenAmount
  )

  // Проверка возможности продажи
  const canSell = !!(
    isConnected &&
    tokenAmount &&
    Number(tokenAmount) > 0 &&
    tokenBalance.data &&
    Number(tokenAmount) <= Number(tokenBalance.formatted) &&
    !isLoading
  )

  // Обработчик продажи
  const handleSellClick = useCallback(async () => {
    if (!canSell) return

    setIsLoading(true)
    try {
      await handleSell(tokenAmount, selectedToken)
      setTokenAmount('') // Очищаем после успеха
    } catch (error) {
      // Ошибка обработана в хуке useSwapOperations
    } finally {
      setIsLoading(false)
    }
  }, [canSell, handleSell, tokenAmount, selectedToken])

  // Максимальная сумма токенов
  const handleMaxClick = useCallback(() => {
    if (!tokenBalance.data) return
    
    const isSelectedTokenETH = selectedToken.address === '0x0000000000000000000000000000000000000000'
    const maxAmount = isSelectedTokenETH
      ? Math.max(0, Number(tokenBalance.formatted) - 0.01) // Резерв на газ для ETH
      : Number(tokenBalance.formatted)
    
    setTokenAmount(maxAmount.toString())
  }, [tokenBalance.data, tokenBalance.formatted, selectedToken.address])

  // Текст кнопки
  const getButtonText = useCallback(() => {
    if (isLoading) return t('processingSale')
    if (!isConnected) return t('connectWallet')
    if (!tokenAmount || Number(tokenAmount) === 0) return t('enterTokenAmount')
    if (tokenBalance.data && Number(tokenAmount) > Number(tokenBalance.formatted)) {
      return t('insufficientTokens', { token: selectedToken.symbol })
    }
    return `💸 ${t('sellFor', { token: selectedToken.symbol, amount: ethAmount })}`
  }, [
    isLoading, 
    isConnected, 
    tokenAmount, 
    tokenBalance.data, 
    tokenBalance.formatted, 
    selectedToken.symbol, 
    ethAmount, 
    t
  ])

  // Цена токена для отображения
  const getTokenPrice = useCallback(() => {
    const prices: Record<string, number> = {
      'ETH': 2000, 'USDC': 1, 'DAI': 1, 'USDT': 1, 'WBTC': 40000
    }
    return prices[selectedToken.symbol] || 1
  }, [selectedToken.symbol])

  // Курс обмена
  const exchangeRateText = React.useMemo(() => {
    if (!tokenAmount || Number(tokenAmount) === 0) return ''
    const rate = (Number(ethAmount) * 2000) / Number(tokenAmount)
    return `1 ${selectedToken.symbol} = $${rate.toFixed(6)} ETH`
  }, [ethAmount, tokenAmount, selectedToken.symbol])

  return (
    <div>
      <PageHeader 
        title={t('sellTokens')}
        subtitle={t('sellDescription')}
        icon="💸"
        gradient="linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)"
      />

      <Card>
        <InputContainer
          label={t('sellingTokens')}
          balance={`${t('balance')}: ${tokenBalance.formatted || '0.0000'} ${tokenBalance.symbol || selectedToken.symbol}`}
          onMaxClick={tokenBalance.data && isConnected ? handleMaxClick : undefined}
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
              label={t('selectTokenForSelling')}
            />
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
          label={t('receivingETH')}
          balance={exchangeRateText ? `${t('rate')}: ${exchangeRateText}` : undefined}
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
              ETH
            </div>
          </div>
        </InputContainer>

        {tokenAmount && Number(tokenAmount) > 0 && (
          <InfoPanel>
            <InfoRow 
              label={t('tokenPrice', { token: selectedToken.symbol })} 
              value={getTokenPrice()?.toString()} 
            />
            <InfoRow 
              label={t('totalCost')} 
              value={`${Number(ethAmount) * 2000}`} 
            />
            <InfoRow 
              label={t('networkFee')} 
              value={t('estimatedGas', { amount: '0.005' })} 
            />
          </InfoPanel>
        )}

        <Button
          variant="danger"
          size="lg"
          fullWidth={true}
          disabled={!canSell}
          loading={isLoading}
          onClick={handleSellClick}
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
          💡 <strong>{t('howItWorks')}</strong>
        </div>
        <div>
          {t('sellExplanation')}
        </div>
      </div>
    </div>
  )
})