import { useQuery } from "@tanstack/react-query"

export function useTokenPrice(tokenSymbol?: string) {
  return useQuery({
    queryKey: ['tokenPrice', tokenSymbol],
    queryFn: async () => {
      // Здесь был бы запрос к API (CoinGecko, CoinMarketCap, etc.)
      // Пока возвращаем моковые данные
      const mockPrices: Record<string, number> = {
        'ETH': 2000,
        'USDC': 1,
        'DAI': 1,
        'USDT': 1,
      }
      
      return mockPrices[tokenSymbol || ''] || 0
    },
    enabled: !!tokenSymbol,
    staleTime: 60 * 1000, // Цены обновляем каждую минуту
  })
}