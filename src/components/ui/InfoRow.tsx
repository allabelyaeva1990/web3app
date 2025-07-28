import React from "react"

interface InfoRowProps {
  label: string
  value: string
  highlight?: boolean
}

export const InfoRow = React.memo<InfoRowProps>(function InfoRow({ 
  label, 
  value, 
  highlight = false 
}) {
  const valueStyle = React.useMemo(() => ({
    fontWeight: highlight ? 'bold' as const : '500' as const,
    color: highlight ? '#007bff' : 'inherit'
  }), [highlight])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px'
    }}>
      <span>{label}</span>
      <span style={valueStyle}>
        {value}
      </span>
    </div>
  )
})
