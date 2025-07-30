import React from "react"
import { TokenPriceDisplay } from "./TokenPriceDisplay"

export const TokenPricesDebug = React.memo(function TokenPricesDebug() {
  const popularTokens = ['ETH', 'USDC', 'DAI', 'USDT', 'WBTC']
  
  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef'
    }}>
      <div style={{ 
        fontSize: '14px', 
        fontWeight: 'bold', 
        marginBottom: '12px',
        color: '#495057'
      }}>
        🔍 Live Token Prices (CoinGecko)
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {popularTokens.map(token => (
          <div key={token} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #dee2e6'
          }}>
            <span style={{ fontWeight: '500' }}>{token}</span>
            <TokenPriceDisplay 
              tokenSymbol={token} 
              size="sm"
              showChange={true}
            />
          </div>
        ))}
      </div>
      
      <div style={{ 
        fontSize: '12px', 
        color: '#6c757d', 
        marginTop: '8px',
        textAlign: 'center'
      }}>
        Обновляется каждую минуту
      </div>
    </div>
  )
})