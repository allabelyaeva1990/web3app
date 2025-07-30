export const formatPrice = (price: number): string => {
  if (price === 0) return '$0.00'
  if (price < 0.01) return `$${price.toFixed(8)}`
  if (price < 1) return `$${price.toFixed(6)}`
  if (price < 100) return `$${price.toFixed(4)}`
  return `$${price.toFixed(2)}`
}

export const formatPriceChange = (change?: number): { 
  text: string
  color: string
  isPositive: boolean 
} => {
  if (!change) {
    return { text: '0.00%', color: '#666', isPositive: false }
  }
  
  const isPositive = change > 0
  return {
    text: `${isPositive ? '+' : ''}${change.toFixed(2)}%`,
    color: isPositive ? '#28a745' : '#dc3545',
    isPositive
  }
}