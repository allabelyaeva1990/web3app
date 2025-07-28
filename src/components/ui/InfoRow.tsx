interface InfoRowProps {
  label: string
  value: string
  highlight?: boolean
}

export function InfoRow({ label, value, highlight = false }: InfoRowProps) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px'
    }}>
      <span>{label}</span>
      <span style={{
        fontWeight: highlight ? 'bold' : '500',
        color: highlight ? '#007bff' : 'inherit'
      }}>
        {value}
      </span>
    </div>
  )
}