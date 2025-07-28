interface CardProps {
  children: React.ReactNode
  maxWidth?: string
  padding?: string
  className?: string
}

export function Card({ 
  children, 
  maxWidth = '480px', 
  padding = '24px',
  className 
}: CardProps) {
  return (
    <div
      className={className}
      style={{
        maxWidth,
        margin: '0 auto',
        border: '1px solid #ddd',
        padding,
        borderRadius: '16px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}
    >
      {children}
    </div>
  )
}
