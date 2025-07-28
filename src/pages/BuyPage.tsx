
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

export const BuyPage = React.memo(function BuyPage() {
  const { t } = useAppLocalization()
  const { isConnected } = useWeb3Connection()  
  
  const { handleBuy, calculateExchangeRate } = useSwapOperations()
  
  // Локальное состояние страницы
  const [ethAmount, setEthAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState<Token>(POPULAR_TOKENS[1])
  const [isLoading, setIsLoading] = useState(false)

  // Баланс ETH 
  const ethBalance = useTokenBalance({
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    decimals: 18,
    name: 'Ethereum'
  })

  // Расчет количества токенов
  const tokenAmount = calculateExchangeRate(
    { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18, name: 'Ethereum' },
    selectedToken,
    ethAmount
  )

  // Проверка возможности покупки
  const canBuy = !!(
    isConnected &&
    ethAmount &&
    Number(ethAmount) > 0 &&
    ethBalance.data &&
    Number(ethAmount) <= Number(ethBalance.formatted) &&
    !isLoading
  )

  // Обработчик покупки
  const handleBuyClick = useCallback(async () => {
    if (!canBuy) return

    setIsLoading(true)
    try {
      await handleBuy(ethAmount, selectedToken)
      setEthAmount('') 
    } catch (error) {
      // Ошибка обработана в хуке
    } finally {
      setIsLoading(false)
    }
  }, [canBuy, handleBuy, ethAmount, selectedToken])

  // Максимальная сумма ETH
  const handleMaxClick = useCallback(() => {
    if (ethBalance.data) {
      const maxAmount = Math.max(0, Number(ethBalance.formatted) - 0.01)
      setEthAmount(maxAmount.toString())
    }
  }, [ethBalance.data, ethBalance.formatted])

  // Текст кнопки
  const getButtonText = () => {
    if (isLoading) return t('processingPurchase')
    if (!isConnected) return t('connectWallet')
    if (!ethAmount || Number(ethAmount) === 0) return t('enterETHAmount')
    if (ethBalance.data && Number(ethAmount) > Number(ethBalance.formatted)) return t('insufficientETH')
    return `${t('buyWith', { token: selectedToken.symbol, amount: ethAmount })}`
  }

  return (
    <div>
      <PageHeader 
        title={t('buyTokens')}
        subtitle={t('buyDescription')}
        icon="💰"
        gradient="linear-gradient(135deg, #28a745 0%, #20c997 100%)"
      />

      <Card>
        <InputContainer
          label={t('paying')}
          balance={`${t('balance')}: ${ethBalance.formatted || '0.0000'} ETH`}
          onMaxClick={ethBalance.data && isConnected ? handleMaxClick : undefined}
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
              ETH
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
          }}>↓</div>
        </div>

        <InputContainer
          label={t('receiving')}
          balance={`${t('rate')}: 1 ETH = ${tokenAmount} ${selectedToken.symbol}`}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <NumberInput
              value={tokenAmount}
              onChange={() => {}}
              placeholder="0.0"
              disabled={true}
            />
            <TokenSelector 
              selectedToken={selectedToken}
              onTokenChange={setSelectedToken}
              label={t('selectTokenForBuying')}
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
            <InfoRow label={t('ethPrice')} value={'2000'} />
            <InfoRow label={t('totalCost')} value={`${Number(ethAmount) * 2000}`} />
            <InfoRow label={t('networkFee')} value={t('estimatedGas', { amount: '0.005' })} />
          </InfoPanel>
        )}
        <Button
          variant="success"
          size="lg"
          fullWidth={true}
          disabled={!canBuy}
          loading={isLoading}
          onClick={handleBuyClick}
        >
          {getButtonText()}
        </Button>
      </Card>
    </div>
  )
})