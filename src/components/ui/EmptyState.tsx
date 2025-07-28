interface EmptyStateProps {
  icon: string
  title: string
  subtitle: string
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <div style={{
      padding: '60px 20px',
      textAlign: 'center',
      color: '#666'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
        {icon}
      </div>
      <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
        {title}
      </div>
      <div style={{ fontSize: '14px' }}>
        {subtitle}
      </div>
    </div>
  )
}
