interface NumberInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  fontSize?: string
}

export function NumberInput({
  value,
  onChange,
  placeholder = '0.0',
  disabled = false,
  fontSize = '32px'
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.replace(/[^0-9.]/g, '')
    // Предотвращаем множественные точки
    const parts = cleanValue.split('.')
    const sanitized = parts.length > 2 
      ? `${parts[0]}.${parts.slice(1).join('')}` 
      : cleanValue
    onChange(sanitized)
  }

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        flex: 1,
        border: 'none',
        fontSize,
        fontWeight: 'bold',
        outline: 'none',
        backgroundColor: 'transparent',
        color: disabled ? '#999' : '#1a1a1a'
      }}
    />
  )
}