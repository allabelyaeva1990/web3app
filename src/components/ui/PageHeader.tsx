import React from "react"

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: string
  gradient?: string
}

export const PageHeader = React.memo<PageHeaderProps>(function PageHeader({ 
  title, 
  subtitle, 
  icon,
  gradient = 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)'
}) {
  return (
    <div style={{ marginBottom: '32px', textAlign: 'center' }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        margin: '0 0 8px 0',
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        {icon && `${icon} `}{title}
      </h1>
      {subtitle && (
        <p style={{ 
          color: '#666', 
          margin: 0, 
          fontSize: '16px' 
        }}>
          {subtitle}
        </p>
      )}
    </div>
  )
})