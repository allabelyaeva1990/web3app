// Компоненты для отображения информации о газе и комиссиях
import React from 'react'
import { useGasTracker, useTransactionCost, useGasUtils } from '../hooks/useGasTracker'

// Мини-индикатор текущей цены газа
interface GasPriceIndicatorProps {
  size?: 'sm' | 'md'
  showDetails?: boolean
  style?: React.CSSProperties
}

export const GasPriceIndicator = React.memo<GasPriceIndicatorProps>(function GasPriceIndicator({
  size = 'sm',
  showDetails = false,
  style
}) {
  const { gasPrices, isLoading, formatGasPrice, getNetworkStatus } = useGasUtils()
  
  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', ...style }}>
        <span style={{ fontSize: size === 'sm' ? '12px' : '14px', color: '#666' }}>
          ⏳ Gas loading...
        </span>
      </div>
    )
  }

  if (!gasPrices) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', ...style }}>
        <span style={{ fontSize: size === 'sm' ? '12px' : '14px', color: '#dc3545' }}>
          ❌ Gas unavailable
        </span>
      </div>
    )
  }

  const networkStatus = getNetworkStatus()
  const fontSize = size === 'sm' ? '12px' : '14px'

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '6px',
      fontSize,
      ...style 
    }}>
      {/* Индикатор состояния сети */}
      <span title={networkStatus.text}>
        {networkStatus.icon}
      </span>
      
      {/* Цена газа */}
      <span style={{ fontWeight: '500', color: '#1a1a1a' }}>
        {formatGasPrice(gasPrices.standard)}
      </span>
      
      {/* Детали при наведении */}
      {showDetails && (
        <div style={{
          fontSize: '11px',
          color: '#666',
          display: 'flex',
          gap: '4px'
        }}>
          <span>S:{formatGasPrice(gasPrices.slow)}</span>
          <span>F:{formatGasPrice(gasPrices.fast)}</span>
        </div>
      )}
      
      {/* Время последнего обновления */}
      <span 
        style={{
          fontSize: '10px',
          color: Date.now() - gasPrices.lastUpdated < 30000 ? '#28a745' : '#ffc107'
        }}
        title={`Обновлено: ${new Date(gasPrices.lastUpdated).toLocaleTimeString()}`}
      >
        •
      </span>
    </div>
  )
})

// Детальная панель с ценами газа
export const GasDetailPanel = React.memo(function GasDetailPanel() {
  const { gasPrices, isLoading, formatGasPrice, getNetworkStatus } = useGasUtils()

  if (isLoading) {
    return (
      <div style={{
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          ⏳ Загрузка газовых цен...
        </div>
      </div>
    )
  }

  if (!gasPrices) {
    return (
      <div style={{
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ textAlign: 'center', color: '#dc3545' }}>
          ❌ Не удалось загрузить данные о газе
        </div>
      </div>
    )
  }

  const networkStatus = getNetworkStatus()
  
  const gasOptions = [
    { key: 'slow', label: 'Медленно', time: '~5+ мин', price: gasPrices.slow },
    { key: 'standard', label: 'Стандарт', time: '~3 мин', price: gasPrices.standard },
    { key: 'fast', label: 'Быстро', time: '~1 мин', price: gasPrices.fast },
    { key: 'instant', label: 'Мгновенно', time: '~15 сек', price: gasPrices.instant }
  ]

  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      border: '1px solid #e1e5e9',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      maxWidth: '480px',
    margin: '0px auto'
    }}>
      {/* Заголовок */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a' }}>
          ⛽ Цены на газ
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          fontSize: '12px',
          color: networkStatus.color
        }}>
          {networkStatus.icon} {networkStatus.text}
        </div>
      </div>

      {/* Сетка с ценами */}
      <div style={{
        display: 'flex',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px'
      }}>
        {gasOptions.map(option => (
          <div
            key={option.key}
            style={{
              padding: '12px',
              backgroundColor: option.key === 'standard' ? '#f0f8ff' : '#f8f9fa',
              borderRadius: '8px',
              border: option.key === 'standard' ? '1px solid #007bff' : '1px solid #e9ecef',
              textAlign: 'center'
            }}
          >
            <div style={{ 
              fontSize: '12px', 
              color: '#666', 
              marginBottom: '4px' 
            }}>
              {option.label}
            </div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              color: option.key === 'standard' ? '#007bff' : '#1a1a1a',
              marginBottom: '2px'
            }}>
              {formatGasPrice(option.price)}
            </div>
            <div style={{ 
              fontSize: '10px', 
              color: '#999' 
            }}>
              {option.time}
            </div>
          </div>
        ))}
      </div>

      {/* Время последнего обновления */}
      <div style={{
        marginTop: '12px',
        fontSize: '11px',
        color: '#999',
        textAlign: 'center'
      }}>
        Обновлено: {new Date(gasPrices.lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  )
})

// Компонент стоимости конкретной операции
interface TransactionCostDisplayProps {
  operationType: 'ETH_transfer' | 'ERC20_transfer' | 'ERC20_approve' | 'swap_simple' | 'swap_complex'
  priority?: 'slow' | 'standard' | 'fast' | 'instant'
  showUSD?: boolean
  style?: React.CSSProperties
}

export const TransactionCostDisplay = React.memo<TransactionCostDisplayProps>(function TransactionCostDisplay({
  operationType,
  priority = 'standard',
  showUSD = true,
  style
}) {
  const { data: cost, isLoading } = useTransactionCost(operationType, priority)
  const { formatGasCost } = useGasUtils()

  if (isLoading) {
    return (
      <span style={{ color: '#666', ...style }}>
        ⏳ Расчет...
      </span>
    )
  }

  if (!cost) {
    return (
      <span style={{ color: '#dc3545', ...style }}>
        ❌ Ошибка расчета
      </span>
    )
  }

  return (
    <span style={{ fontWeight: '500', ...style }}>
      {showUSD && cost.usdCost 
        ? formatGasCost(cost.totalCost)
        : `${cost.totalCost} ETH`
      }
    </span>
  )
})

// Компактный компонент для отображения в интерфейсе свопа
interface SwapGasCostProps {
  style?: React.CSSProperties
}

export const SwapGasCost = React.memo<SwapGasCostProps>(function SwapGasCost({ style }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      ...style 
    }}>
      <TransactionCostDisplay 
        operationType="swap_simple"
        priority="standard"
        showUSD={true}
        style={{ fontSize: '14px', color: '#1a1a1a' }}
      />
    </div>
  )
})

// Индикатор в Header для постоянного отображения
export const HeaderGasIndicator = React.memo(function HeaderGasIndicator() {
  const { gasPrices, formatGasPrice, getNetworkStatus } = useGasUtils()

  if (!gasPrices) return null

  const networkStatus = getNetworkStatus()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 8px',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      fontSize: '12px',
      border: '1px solid #e9ecef'
    }}>
      <span title="Состояние сети">
        {networkStatus.icon}
      </span>
      <span style={{ fontWeight: '500' }}>
        {formatGasPrice(gasPrices.standard)}
      </span>
    </div>
  )
})

// Детальный компонент для страницы настроек или модалки
export const GasTrackerDebug = React.memo(function GasTrackerDebug() {
  const { data: gasPrices, isLoading, error } = useGasTracker()
  const swapCost = useTransactionCost('swap_simple', 'standard')
  const transferCost = useTransactionCost('ERC20_transfer', 'standard')

  if (isLoading) {
    return (
      <div style={{
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ textAlign: 'center' }}>⏳ Загрузка данных о газе...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ textAlign: 'center', color: '#dc3545' }}>
          ❌ Ошибка загрузки: {error.message}
        </div>
      </div>
    )
  }

  if (!gasPrices) {
    return (
      <div style={{
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ textAlign: 'center' }}>❓ Нет данных о газе</div>
      </div>
    )
  }

  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      
    }}>
      <div style={{ 
        fontSize: '14px', 
        fontWeight: 'bold', 
        marginBottom: '12px',
        color: '#495057',
      }}>
        ⛽ Gas Tracker Debug Info
      </div>
      
      {/* Цены газа */}
      <div><div style={{ marginBottom: '16px', 
      display: 'flex', 
      alignItems: 'center',
      gap: '16px' }}>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
          Текущие цены (Gwei):
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '8px' 
        }}>
          <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: '#999' }}>Медленно</div>
            <div style={{ fontWeight: 'bold' }}>{gasPrices.slow}</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: '#999' }}>Стандарт</div>
            <div style={{ fontWeight: 'bold', color: '#007bff' }}>{gasPrices.standard}</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: '#999' }}>Быстро</div>
            <div style={{ fontWeight: 'bold' }}>{gasPrices.fast}</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: '#999' }}>Мгновенно</div>
            <div style={{ fontWeight: 'bold' }}>{gasPrices.instant}</div>
          </div>
        </div>
      </div>

      {/* Стоимость операций */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
          Стоимость операций:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '4px 8px',
            backgroundColor: 'white',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            <span>Своп токенов:</span>
            <span style={{ fontWeight: '500' }}>
              {swapCost.data ? `${swapCost.data.totalCost} ETH` : '⏳'}
              {swapCost.data?.usdCost && (
                <span style={{ color: '#666', marginLeft: '4px' }}>
                  (~${swapCost.data.usdCost})
                </span>
              )}
            </span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '4px 8px',
            backgroundColor: 'white',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            <span>Перевод токена:</span>
            <span style={{ fontWeight: '500' }}>
              {transferCost.data ? `${transferCost.data.totalCost} ETH` : '⏳'}
              {transferCost.data?.usdCost && (
                <span style={{ color: '#666', marginLeft: '4px' }}>
                  (~${transferCost.data.usdCost})
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Статус сети */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
          Состояние сети:
        </div>
        <div style={{
          padding: '8px',
          backgroundColor: 'white',
          borderRadius: '4px',
          fontSize: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Загруженность: {gasPrices.networkCongestion}</span>
          <span style={{ fontSize: '10px', color: '#999' }}>
            Обновлено: {new Date(gasPrices.lastUpdated).toLocaleTimeString()}
          </span>
        </div>
      </div></div>
      
    </div>
  )
})