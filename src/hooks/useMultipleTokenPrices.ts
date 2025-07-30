/**
 * Хук для получения цен нескольких токенов
 * Полезен для страниц со списками токенов
 */
import { useQuery } from "@tanstack/react-query"
import { type TokenPrice, PriceService } from "../services"
import type { UseTokenPriceOptions } from "./useTokenPrice"

export function useMultipleTokenPrices(
  tokenSymbols: string[],
  options: UseTokenPriceOptions = {}
) {
  const { 
    refetchInterval = 60 * 1000,
    enabled = true 
  } = options

  return useQuery<Record<string, TokenPrice>>({
    queryKey: ['multipleTokenPrices', tokenSymbols.sort()], // Сортируем для стабильного ключа
    
    queryFn: async () => {
      if (tokenSymbols.length === 0) {
        return {}
      }
      
      return await PriceService.getMultipleTokenPrices(tokenSymbols)
    },
    
    enabled: enabled && tokenSymbols.length > 0,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    
    retry: (failureCount) => failureCount < 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}