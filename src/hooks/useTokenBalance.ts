import { useBalance as useWagmiBalance, useAccount } from 'wagmi'
import type { Address } from 'viem'
import { useMemo } from 'react'
import type { Token } from '../store/atoms'

export function useTokenBalance(token?: Token) {
  const { address } = useAccount()
  
  // Определяем, является ли токен ETH
  const isETH = !token?.address || token?.address === '0x0000000000000000000000000000000000000000'
  
  console.log('🔍 useTokenBalance:', {
    address,
    tokenAddress: token?.address,
    isETH,
    enabled: !!address
  })
  
  const result = useWagmiBalance({
    address,
    token: isETH ? undefined : (token?.address as Address),
    query: {
      enabled: !!address, 
      refetchInterval: 15 * 1000,
      retry: 3,
      retryDelay: 1000,
    }
  })

  console.log('🔍 Balance result:', {
    data: result.data,
    formatted: result.data?.formatted,
    symbol: result.data?.symbol,
    isLoading: result.isLoading,
    error: result.error
  })

  const balanceInfo = useMemo(() => ({
    formatted: result.data?.formatted || '0',
    symbol: result.data?.symbol || (isETH ? 'ETH' : token?.symbol || 'TOKEN'),
    decimals: result.data?.decimals || (isETH ? 18 : token?.decimals || 18),
    value: result.data?.value || BigInt(0),
    isZero: !result.data?.value || result.data.value === BigInt(0),
    isLoading: result.isLoading,
    hasError: !!result.error,
    formattedShort: result.data?.formatted 
      ? Number(result.data.formatted).toFixed(Math.min(4, result.data.decimals))
      : '0.0000',
  }), [result.data, result.isLoading, result.error, isETH, token])

  return {
    ...result,
    ...balanceInfo
  }
}