import React from "react"

interface FlipButtonProps {
  onClick: () => void
}

export const FlipButton = React.memo<FlipButtonProps>(function FlipButton({ onClick }) {
  const hoverHandlers = React.useMemo(() => ({
    onMouseOver: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.borderColor = '#007bff'
      e.currentTarget.style.transform = 'rotate(180deg)'
    },
    onMouseOut: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.borderColor = '#e1e5e9'
      e.currentTarget.style.transform = 'rotate(0deg)'
    }
  }), [])

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
        {...hoverHandlers}
      >
        ⇅
      </button>
    </div>
  )
})