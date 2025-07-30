import React from "react"
import { useTokenPrice } from "../hooks"

interface ExchangeRateDisplayProps {
  fromToken: string
  toToken: string
  amount: string
  style?: React.CSSProperties
}

export const ExchangeRateDisplay = React.memo<ExchangeRateDisplayProps>(function ExchangeRateDisplay({
  fromToken,
  toToken,
  amount,
  style
}) {
  const { data: tokenPrice, isLoading } = useTokenPrice(fromToken)
  
  if (isLoading) {
    return (
      <span style={{ color: '#666', ...style }}>
        ⏳ Calculating...
      </span>
    )
  }

  if (!tokenPrice || !amount || Number(amount) === 0) {
    return (
      <span style={{ color: '#666', ...style }}>
        Enter amount
      </span>
    )
  }

  return (
    <span style={{ color: '#007bff', fontWeight: '500', ...style }}>
      1 {fromToken} = {tokenPrice.price} {toToken}
    </span>
  )
})