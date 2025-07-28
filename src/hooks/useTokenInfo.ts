import { useReadContract } from "wagmi"
import type { Address } from "viem"
import { useQuery } from '@tanstack/react-query'
import { ERC20_ABI } from "../constants/erc-20-abi"


// Хук для получения данных ERC20 токена
export function useTokenInfo(tokenAdress?: string) {
  // Читаем название токена
  const { data: name } = useReadContract({
    address: tokenAdress as Address,
    abi: ERC20_ABI,
    functionName: 'name',
    query: { 
      enabled: !!(tokenAdress && tokenAdress !== '0x0000000000000000000000000000000000000000')
    }
  })

  // Читаем символ токена
  const { data: symbol } = useReadContract({
    address: tokenAdress as Address,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: { 
      enabled: !!(tokenAdress && tokenAdress !== '0x0000000000000000000000000000000000000000')
    }
  })

  // Читаем количество decimals
  const { data: decimals } = useReadContract({
    address: tokenAdress as Address,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: { 
      enabled: !!(tokenAdress && tokenAdress !== '0x0000000000000000000000000000000000000000')
    }
  })

  // Возвращаем данные токена или ETH по умолчанию
  return useQuery({
    queryKey: ['tokenInfo', tokenAdress],
    queryFn: () => {
      if (!tokenAdress || tokenAdress === '0x0000000000000000000000000000000000000000') {
        return {
          name: 'Ethereum',
          symbol: 'ETH',
          decimals: 18
        }
      }
      
      return {
        name: name || 'Unknown Token',
        symbol: symbol || 'UNKNOWN',
        decimals: decimals || 18
      }
    },
    enabled: true,
    // Данные токена меняются очень редко, можно кэшировать надолго
    staleTime: 24 * 60 * 60 * 1000, // 24 часа
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 дней
  })
}