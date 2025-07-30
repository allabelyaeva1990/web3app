import { useQuery } from "@tanstack/react-query"
import { PriceService } from "../services"

/**
 * Хук для расчета курса обмена между токенами
 * Использует реальные цены для точного расчета
 */
export function useExchangeRate(
  fromToken?: string,
  toToken?: string,
  amount?: string
) {
  return useQuery<string>({
    queryKey: ['exchangeRate', fromToken, toToken, amount],
    
    queryFn: async () => {
      if (!fromToken || !toToken || !amount || amount === '0') {
        return '0'
      }
      
      return await PriceService.calculateExchangeRate(fromToken, toToken, amount)
    },
    
    enabled: !!(fromToken && toToken && amount && Number(amount) > 0),
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000, // Курсы обмена кэшируем меньше
    refetchInterval: 30 * 1000, // Обновляем каждые 30 сек
    
    retry: 2, // Меньше попыток для быстроты
  })
}