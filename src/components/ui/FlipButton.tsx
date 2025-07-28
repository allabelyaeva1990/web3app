interface FlipButtonProps {
  onClick: () => void
}

export function FlipButton({ onClick }: FlipButtonProps) {
  return (
    <div style={{ textAlign: 'center', margin: '16px 0' }}>
      <button
        onClick={onClick}
        style={{
          background: '#fff',
          border: '2px solid #e1e5e9',
          borderRadius: '16px',
          width: '56px',
          height: '56px',
          cursor: 'pointer',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = '#007bff'
          e.currentTarget.style.transform = 'rotate(180deg)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = '#e1e5e9'
          e.currentTarget.style.transform = 'rotate(0deg)'
        }}
      >
        ⇅
      </button>
    </div>
  )
}