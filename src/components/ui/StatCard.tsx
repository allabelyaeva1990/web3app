interface StatCardProps {
  value: number | string
  label: string
  color?: string
}

export function StatCard({ value, label, color = '#007bff' }: StatCardProps) {
  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #e1e5e9',
      textAlign: 'center'
    }}>
      <div style={{ 
        fontSize: '24px', 
        fontWeight: 'bold', 
        color 
      }}>
        {value}
      </div>
      <div style={{ 
        fontSize: '14px', 
        color: '#666' 
      }}>
        {label}
      </div>
    </div>
  )
}
