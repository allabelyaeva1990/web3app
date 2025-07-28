interface FilterButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

export function FilterButton({ active, onClick, children }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        border: '1px solid',
        borderColor: active ? '#007bff' : '#ddd',
        borderRadius: '6px',
        backgroundColor: active ? '#f0f8ff' : 'white',
        color: active ? '#007bff' : '#666',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500',
        transition: 'all 0.2s'
      }}
      onMouseOver={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = '#007bff'
          e.currentTarget.style.color = '#007bff'
        }
      }}
      onMouseOut={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = '#ddd'
          e.currentTarget.style.color = '#666'
        }
      }}
    >
      {children}
    </button>
  )
}