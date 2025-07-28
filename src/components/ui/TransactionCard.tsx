interface TransactionCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transaction: any // тип будет из atoms
  onMouseOver?: () => void
  onMouseOut?: () => void
  isLast?: boolean
}

export function TransactionCard({ 
  transaction: tx, 
  onMouseOver, 
  onMouseOut, 
  isLast = false 
}: TransactionCardProps) {
  // Функции для получения типа операции, иконки и цвета статуса
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getOperationType = (tx: any) => {
    if (tx.inputToken.symbol === 'ETH' && tx.outputToken.symbol !== 'ETH') {
      return { type: 'buy', icon: '💰', label: 'Покупка' }
    }
    if (tx.inputToken.symbol !== 'ETH' && tx.outputToken.symbol === 'ETH') {
      return { type: 'sell', icon: '💸', label: 'Продажа' }
    }
    return { type: 'swap', icon: '🔄', label: 'Обмен' }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'success': return '✅'
      case 'failed': return '❌'
      default: return '❓'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffc107'
      case 'success': return '#28a745'
      case 'failed': return '#dc3545'
      default: return '#6c757d'
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const operation = getOperationType(tx)

  return (
    <div
      style={{
        padding: '20px',
        borderBottom: !isLast ? '1px solid #f1f3f4' : 'none',
        transition: 'background-color 0.2s',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#f8f9fa'
        onMouseOver?.()
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
        onMouseOut?.()
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '16px'
      }}>
        {/* Левая часть - иконка и детали */}
        <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            {operation.icon}
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px'
            }}>
              <span style={{ fontWeight: '600', fontSize: '16px' }}>
                {operation.label}
              </span>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: `${getStatusColor(tx.status)}20`,
                  color: getStatusColor(tx.status)
                }}
              >
                {getStatusIcon(tx.status)} {
                  tx.status === 'pending' ? 'В ожидании' :
                  tx.status === 'success' ? 'Успешно' : 'Неудачно'
                }
              </span>
            </div>
            
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
              {tx.inputAmount} {tx.inputToken.symbol} → {tx.outputAmount} {tx.outputToken.symbol}
            </div>
            
            <div style={{ fontSize: '12px', color: '#999' }}>
              {formatDate(tx.timestamp)}
            </div>
            
            {tx.txHash && (
              <div style={{ fontSize: '12px', color: '#007bff', marginTop: '4px' }}>
                TxHash: {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
              </div>
            )}
          </div>
        </div>
        
        {/* Правая часть - курс обмена */}
        <div style={{ textAlign: 'right', fontSize: '14px', color: '#666' }}>
          <div style={{ fontWeight: '500' }}>
            Курс: 1 {tx.inputToken.symbol} = {(Number(tx.outputAmount) / Number(tx.inputAmount)).toFixed(6)} {tx.outputToken.symbol}
          </div>
          {tx.gasUsed && (
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              Gas: {tx.gasUsed}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}