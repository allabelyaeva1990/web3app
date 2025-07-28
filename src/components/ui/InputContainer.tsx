import React from "react"

interface InputContainerProps {
  label: string
  balance?: string
  onMaxClick?: () => void
  children: React.ReactNode
}

export const InputContainer = React.memo<InputContainerProps>(function InputContainer({ 
  label, 
  balance, 
  onMaxClick, 
  children 
}) {
  const handleClick = React.useCallback(() => {
    onMaxClick?.()
  }, [onMaxClick])

  return (
    <div style={{
      border: '2px solid #f1f3f4',
      padding: '20px',
      borderRadius: '16px',
      marginBottom: '16px',
      backgroundColor: '#fafbfc'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '16px',
        fontSize: '14px',
        color: '#666'
      }}>
        <span style={{ fontWeight: '500' }}>{label}</span>
        {balance && (
          <span 
            style={{ 
              cursor: onMaxClick ? 'pointer' : 'default',
              fontWeight: '500'
            }}
            onClick={handleClick}
          >
            {balance}
            {onMaxClick && (
              <span style={{ color: '#007bff', marginLeft: '8px' }}>MAX</span>
            )}
          </span>
        )}
      </div>
      {children}
    </div>
  )
})