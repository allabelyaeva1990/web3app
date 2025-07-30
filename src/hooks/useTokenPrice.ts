import { useQuery } from "@tanstack/react-query"
import { PriceService, type TokenPrice } from "../services/PriceService"

export interface UseTokenPriceOptions {
  // Интервал обновления цен (по умолчанию 60 сек)
  refetchInterval?: number
  // Включить/выключить автообновление
  enabled?: boolean
}

export function useTokenPrice(
  tokenSymbol?: string, 
  options: UseTokenPriceOptions = {}
) {
  const { 
    refetchInterval = 60 * 1000, // 1 минута
    enabled = true 
  } = options

  return useQuery<TokenPrice>({
    // Уникальный ключ для кэширования (как в NgRx selector)
    queryKey: ['tokenPrice', tokenSymbol],
    
    // Функция получения данных (как Angular service method)
    queryFn: async () => {
      if (!tokenSymbol) {
        throw new Error('Token symbol is required')
      }
      
      return await PriceService.getTokenPriceWithChange(tokenSymbol)
    },
    
    // Настройки кэширования и обновления
    enabled: enabled && !!tokenSymbol && PriceService.isSupportedToken(tokenSymbol || ''),
    staleTime: 30 * 1000, // 30 сек - данные считаются свежими
    gcTime: 5 * 60 * 1000, // 5 мин - время жизни в памяти
    refetchInterval, // Автообновление
    refetchOnWindowFocus: true, // Обновляем при фокусе окна
    refetchOnReconnect: true, // Обновляем при восстановлении сети
    
    // Retry логика (как в Angular interceptor)
    retry: (failureCount, error) => {
      // Не повторяем если токен не поддерживается
      if (error instanceof Error && error.message.includes('Неизвестный токен')) {
        return false
      }
      // Максимум 3 попытки для сетевых ошибок
      return failureCount < 3
    },
    
    // Exponential backoff для повторных попыток
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}