import React from "react"

interface CardProps {
  children: React.ReactNode
  maxWidth?: string
  padding?: string
  className?: string
}

export const Card = React.memo<CardProps>(function Card({ 
  children, 
  maxWidth = '480px', 
  padding = '24px',
  className 
}) {
  const style = React.useMemo(() => ({
    maxWidth,
    margin: '0 auto',
    border: '1px solid #ddd',
    padding,
    borderRadius: '16px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  }), [maxWidth, padding])

  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
})
