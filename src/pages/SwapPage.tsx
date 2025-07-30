import React from 'react'
import { 
  Card, 
  InputContainer, 
  NumberInput, 
  FlipButton, 
  InfoPanel, 
  InfoRow,
  PageHeader,
  Button
} from '../components/ui'
import { 
  TokenSelector, 
  TokenPriceDisplay, 
  SwapGasCost, 
  GasTrackerDebug } from '../components'
import { 
  useSwapOperations,
  useWeb3Connection,
  useAppLocalization 
} from '../hooks'

export const SwapPage = React.memo(function SwapPage() {
  const { t } = useAppLocalization()
  const { isConnected } = useWeb3Connection()
  const {
    // Состояние
    inputAmount,
    outputAmount,
    inputToken,
    outputToken,
    inputBalance,
    outputBalance,
    swapInfo,
    canSwap,
    
    // Обработчики  
    handleInputChange,
    handleMaxClick,
    handleSwap,
    handleFlipTokens,
    
    // Сеттеры
    setInputToken,
    setOutputToken,
    
    // Утилиты
    getSwapButtonText,
    formatBalance
  } = useSwapOperations()

  return (
    <div>
      <TokenPriceDisplay tokenSymbol={inputToken.symbol}></TokenPriceDisplay>
      <PageHeader 
        title={t('swap')}
        subtitle="Обменивайте токены по лучшему курсу"
        icon="🔄"
      />

      {/* Отладочная панель с реальными ценами и газом в development */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ marginBottom: '24px' }}>
          <GasTrackerDebug />
        </div>
      )}

      <Card>
        <InputContainer
          label={t('selling')}
          balance={formatBalance(inputBalance, inputBalance.isLoading)}
          onMaxClick={inputBalance.data && isConnected ? handleMaxClick : undefined}
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
              label={t('selectTokenForSelling')}
              excludeToken={outputToken}
            />
          </div>
        </InputContainer>

        <FlipButton onClick={handleFlipTokens} />

        <InputContainer
          label={t('buying')}
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
              label={t('selectTokenForBuying')}
              excludeToken={inputToken}
            />
          </div>
        </InputContainer>

        {swapInfo.hasValidAmounts && (
          <InfoPanel>
            <InfoRow 
              label={t('exchangeRate')}
              value={`1 ${inputToken.symbol} = ${swapInfo.exchangeRate.toFixed(6)} ${outputToken.symbol}`}
            />
            <InfoRow 
              label={t('slippage')}
              value={`${swapInfo.slippage}%`}
            />
            <InfoRow 
              label="Deadline"
              value={`${swapInfo.deadline} мин`}
            />
            <InfoRow 
              label={t('minimumReceived')}
              value={`${swapInfo.minimumReceived, outputToken.symbol}`}
              highlight={true}
            />
            <InfoRow 
              label={t('priceImpact')}
              value={swapInfo.priceImpact}
            />
            {/* Реальная стоимость газа */}
            
            <InfoRow 
              label={t('networkFee')}
              value={<SwapGasCost />}
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
          {getSwapButtonText}
        </Button>
      </Card>
    </div>
  )
})