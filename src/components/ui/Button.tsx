interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  children,
  onClick,
  type = 'button'
}: ButtonProps) {
  // 🎨 Базовые стили (одно место!)
  const baseStyles: React.CSSProperties = {
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '16px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: fullWidth ? '100%' : 'auto'
  }

  // 📏 Размеры
  const sizeStyles = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '12px 20px', fontSize: '16px' },
    lg: { padding: '18px 24px', fontSize: '18px' }
  }

  // 🎨 Цветовые схемы
  const variantStyles = {
    primary: {
      backgroundColor: disabled ? '#e9ecef' : '#007bff',
      color: disabled ? '#6c757d' : 'white'
    },
    secondary: {
      backgroundColor: disabled ? '#e9ecef' : '#6c757d',
      color: disabled ? '#adb5bd' : 'white'
    },
    success: {
      backgroundColor: disabled ? '#e9ecef' : '#28a745',
      color: disabled ? '#6c757d' : 'white'
    },
    danger: {
      backgroundColor: disabled ? '#e9ecef' : '#dc3545',
      color: disabled ? '#6c757d' : 'white'
    },
    warning: {
      backgroundColor: disabled ? '#e9ecef' : '#ffc107',
      color: disabled ? '#6c757d' : '#212529'
    }
  }

  // 🎭 Hover эффекты
  const hoverStyles = {
    primary: '#0056b3',
    secondary: '#5a6268',
    success: '#218838',
    danger: '#c82333',
    warning: '#e0a800'
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant]
      }}
      onMouseOver={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.backgroundColor = hoverStyles[variant]
        }
      }}
      onMouseOut={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.backgroundColor = variantStyles[variant].backgroundColor
        }
      }}
    >
      {loading && <span>⏳</span>}
      {children}
    </button>
  )
}