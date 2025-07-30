// Компонент для отображения цены токена с изменением за 24ч
import React from 'react'
import { useTokenPrice } from '../hooks/useTokenPrice'
import { formatPrice, formatPriceChange } from '../utils'

interface TokenPriceDisplayProps {
  tokenSymbol: string
  // Размер отображения
  size?: 'sm' | 'md' | 'lg'
  // Показывать ли изменение за 24ч
  showChange?: boolean
  // Показывать ли индикатор загрузки
  showLoading?: boolean
  // Кастомные стили
  style?: React.CSSProperties
}

export const TokenPriceDisplay = React.memo<TokenPriceDisplayProps>(function TokenPriceDisplay({
  tokenSymbol,
  size = 'md',
  showChange = true,
  showLoading = true,
  style
}) {
  const { data: priceData, isLoading, error } = useTokenPrice(tokenSymbol)

  // Стили в зависимости от размера
  const sizeStyles = { fontSize: '14px', gap: '6px' }

  // Контейнер стили
  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: sizeStyles.gap,
    fontSize: sizeStyles.fontSize,
    ...style
  }

  // Состояние загрузки
  if (isLoading && showLoading) {
    return (
      <div style={containerStyle}>
        <span style={{ color: '#666' }}>
          ⏳ Loading...
        </span>
      </div>
    )
  }

  // Состояние ошибки
  if (error) {
    return (
      <div style={containerStyle}>
        <span style={{ color: '#dc3545' }}>
          ❌ Error
        </span>
      </div>
    )
  }

  // Нет данных
  if (!priceData) {
    return (
      <div style={containerStyle}>
        <span style={{ color: '#666' }}>
          N/A
        </span>
      </div>
    )
  }

  const priceChangeInfo = formatPriceChange(priceData.change24h)

  return (
    <div style={containerStyle}>
      <span style={{ 
        fontWeight: size === 'lg' ? 'bold' : '500',
        color: '#1a1a1a'
      }}>
        {formatPrice(priceData.price)}
      </span>

      {showChange && priceData.change24h !== undefined && (
        <span style={{
          color: priceChangeInfo.color,
          fontSize: size === 'lg' ? '14px' : '12px',
          fontWeight: '500'
        }}>
          {priceChangeInfo.isPositive ? '📈' : '📉'} {priceChangeInfo.text}
        </span>
      )}

      {priceData.lastUpdated && (
        <span 
          title={`Обновлено: ${new Date(priceData.lastUpdated).toLocaleTimeString()}`}
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: Date.now() - priceData.lastUpdated < 2 * 60 * 1000 ? '#28a745' : '#ffc107',
            flexShrink: 0
          }}
        />
      )}
    </div>
  )
})

