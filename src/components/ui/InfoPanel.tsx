interface InfoPanelProps {
  children: React.ReactNode
}

export function InfoPanel({ children }: InfoPanelProps) {
  return (
    <div style={{
      fontSize: '14px',
      color: '#666',
      marginBottom: '20px',
      padding: '16px',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      border: '1px solid #e9ecef'
    }}>
      {children}
    </div>
  )
}