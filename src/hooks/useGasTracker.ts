// Хук для отслеживания газовых цен и расчета комиссий
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { GasService, type GasPrice, type GasEstimate } from '../services/GasService'
import { useTokenPrice } from './useTokenPrice'

interface UseGasTrackerOptions {
  // Интервал обновления (по умолчанию 15 сек)
  refetchInterval?: number
  // Включить/выключить
  enabled?: boolean
}

/**
 * Основной хук для получения текущих цен на газ
 * Аналог сервиса в Angular с автообновлением
 */
export function useGasTracker(options: UseGasTrackerOptions = {}) {
  const { refetchInterval = 15 * 1000, enabled = true } = options

  return useQuery<GasPrice>({
    queryKey: ['gasPrices'],
    queryFn: () => GasService.getCurrentGasPrices(),
    
    enabled,
    staleTime: 10 * 1000,        // 10 сек - данные свежие
    gcTime: 2 * 60 * 1000,       // 2 мин в памяти
    refetchInterval,             // Автообновление каждые 15 сек
    refetchOnWindowFocus: true,  // При фокусе окна
    refetchOnReconnect: true,    // При подключении к сети
    
    // Retry логика для газа (быстрее чем для цен)
    retry: 2,
    retryDelay: 1000, // 1 секунда между попытками
  })
}

/**
 * Хук для расчета стоимости конкретной транзакции
 */
export function useTransactionCost(
  operationType: keyof ReturnType<typeof GasService.getGasLimits>,
  priority: 'slow' | 'standard' | 'fast' | 'instant' = 'standard'
) {
  // Получаем текущую цену ETH для USD конвертации
  const { data: ethPrice } = useTokenPrice('ETH')
  
  return useQuery<GasEstimate & { usdCost?: string }>({
    queryKey: ['transactionCost', operationType, priority],
    queryFn: async () => {
      const gasLimits = GasService.getGasLimits()
      const gasLimit = gasLimits[operationType]
      
      const estimate = await GasService.estimateTransactionCost(gasLimit, priority)
      
      // Добавляем USD стоимость если есть цена ETH
      if (ethPrice?.price) {
        const usdCost = (Number(estimate.totalCost) * ethPrice.price).toFixed(2)
        return { ...estimate, usdCost }
      }
      
      return estimate
    },
    
    enabled: !!operationType,
    staleTime: 10 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchInterval: 15 * 1000,
  })
}

/**
 * Хук для получения рекомендаций по газу
 */
export function useGasRecommendation(maxWaitMinutes: number = 3) {
  return useQuery({
    queryKey: ['gasRecommendation', maxWaitMinutes],
    queryFn: () => GasService.getCurrentGasPrices(),
    
    staleTime: 15 * 1000,
    gcTime: 60 * 1000,
    refetchInterval: 20 * 1000,
  })
}

/**
 * Хук с готовыми форматерами и утилитами
 */
export function useGasUtils() {
  const { data: gasPrices, isLoading, error } = useGasTracker()
  const { data: ethPrice } = useTokenPrice('ETH')

  // Мемоизируем утилиты (как computed в Angular)
  const utils = useMemo(() => ({
    // Форматирование газовой цены
    formatGasPrice: (gwei: number) => GasService.formatGasPrice(gwei),
    
    // Форматирование стоимости с USD
    formatGasCost: (ethCost: string) => 
      GasService.formatGasCost(ethCost, ethPrice?.price),
    
    // Получить статус сети по цветам
    getNetworkStatus: () => {
      if (!gasPrices) return { color: '#666', text: 'Загрузка...', icon: '⏳' }
      
      const congestion = gasPrices.networkCongestion
      const statusMap = {
        low: { color: '#28a745', text: 'Низкая нагрузка', icon: '🟢' },
        medium: { color: '#ffc107', text: 'Средняя нагрузка', icon: '🟡' },
        high: { color: '#dc3545', text: 'Высокая нагрузка', icon: '🔴' }
      }
      
      return statusMap[congestion]
    },
    
    // Рекомендация по времени транзакции
    getTimeRecommendation: (gasPrice: number) => {
      if (!gasPrices) return 'Загрузка...'
      
      if (gasPrice >= gasPrices.instant) return '~15 секунд'
      if (gasPrice >= gasPrices.fast) return '~1 минута'  
      if (gasPrice >= gasPrices.standard) return '~3 минуты'
      return '~5+ минут'
    },
    
    // Проверка разумности цены газа
    isReasonableGasPrice: (gasPrice: number) => {
      if (!gasPrices) return true
      return gasPrice >= gasPrices.slow && gasPrice <= gasPrices.instant * 1.5
    }
  }), [gasPrices, ethPrice])

  return {
    gasPrices,
    isLoading,
    error,
    ...utils
  }
}

/**
 * Хук для сравнения стоимости разных операций
 * Полезен для показа пользователю альтернатив
 */
export function useGasComparison(operations: string[]) {
  const { data: ethPrice } = useTokenPrice('ETH')
  
  return useQuery({
    queryKey: ['gasComparison', operations],
    queryFn: async () => {
      const gasLimits = GasService.getGasLimits()
      const comparisons = []
      
      for (const operation of operations) {
        if (operation in gasLimits) {
          const estimates = await Promise.all([
            GasService.estimateTransactionCost(gasLimits[operation as keyof typeof gasLimits], 'slow'),
            GasService.estimateTransactionCost(gasLimits[operation as keyof typeof gasLimits], 'standard'),
            GasService.estimateTransactionCost(gasLimits[operation as keyof typeof gasLimits], 'fast')
          ])
          
          comparisons.push({
            operation,
            slow: estimates[0],
            standard: estimates[1], 
            fast: estimates[2]
          })
        }
      }
      
      return comparisons
    },
    
    enabled: operations.length > 0,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}