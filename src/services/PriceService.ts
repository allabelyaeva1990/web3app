// Сервис для получения реальных цен токенов через CoinGecko API

// Типы для API ответов
interface CoinGeckoPrice {
  [key: string]: {
    usd: number
    usd_24h_change?: number
  }
}

interface TokenPrice {
  price: number
  change24h?: number
  lastUpdated: number
}

interface PriceCache {
  [tokenId: string]: TokenPrice
}

// Маппинг символов токенов к ID в CoinGecko
const TOKEN_ID_MAP: Record<string, string> = {
  'ETH': 'ethereum',
  'USDC': 'usd-coin',
  'DAI': 'dai',
  'USDT': 'tether',
  'WBTC': 'wrapped-bitcoin',
  'UNI': 'uniswap',
  'LINK': 'chainlink',
  'AAVE': 'aave',
  'COMP': 'compound-governance-token',
  'MKR': 'maker'
}

export class PriceService {
  private static cache: PriceCache = {}
  private static readonly CACHE_DURATION = 60 * 1000 // 1 минута
  private static readonly BASE_URL = 'https://api.coingecko.com/api/v3'
  private static readonly FALLBACK_PRICES: Record<string, number> = {
    'ETH': 2000,
    'USDC': 1,
    'DAI': 1,
    'USDT': 1,
    'WBTC': 40000
  }

  /**
   * Получить цену одного токена
   * @param symbol - символ токена (ETH, USDC, etc.)
   * @returns цена в USD
   */
  static async getTokenPrice(symbol: string): Promise<number> {
    try {
      const priceData = await this.getTokenPriceWithChange(symbol)
      return priceData.price
    } catch (error) {
      console.warn(`Не удалось получить цену для ${symbol}, используем fallback`, error)
      return this.FALLBACK_PRICES[symbol] || 1
    }
  }

  /**
   * Получить цену токена с данными об изменении за 24ч
   * @param symbol - символ токена
   * @returns объект с ценой и изменением
   */
  static async getTokenPriceWithChange(symbol: string): Promise<TokenPrice> {
    const tokenId = TOKEN_ID_MAP[symbol]
    if (!tokenId) {
      throw new Error(`Неизвестный токен: ${symbol}`)
    }

    // Проверяем кэш
    const cached = this.cache[tokenId]
    if (cached && Date.now() - cached.lastUpdated < this.CACHE_DURATION) {
      return cached
    }

    // Запрашиваем данные с API
    const url = `${this.BASE_URL}/simple/price?ids=${tokenId}&vs_currencies=usd&include_24hr_change=true`
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data: CoinGeckoPrice = await response.json()
    const tokenData = data[tokenId]

    if (!tokenData) {
      throw new Error(`Нет данных для токена ${symbol}`)
    }

    const priceData: TokenPrice = {
      price: tokenData.usd,
      change24h: tokenData.usd_24h_change,
      lastUpdated: Date.now()
    }

    // Сохраняем в кэш
    this.cache[tokenId] = priceData
    
    return priceData
  }

  /**
   * Получить цены нескольких токенов за один запрос
   * @param symbols - массив символов токенов
   * @returns объект с ценами
   */
  static async getMultipleTokenPrices(symbols: string[]): Promise<Record<string, TokenPrice>> {
    try {
      // Фильтруем только известные токены
      const validSymbols = symbols.filter(symbol => TOKEN_ID_MAP[symbol])
      const tokenIds = validSymbols.map(symbol => TOKEN_ID_MAP[symbol])
      
      if (tokenIds.length === 0) {
        throw new Error('Нет валидных токенов для запроса')
      }

      const url = `${this.BASE_URL}/simple/price?ids=${tokenIds.join(',')}&vs_currencies=usd&include_24hr_change=true`
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }

      const data: CoinGeckoPrice = await response.json()
      const results: Record<string, TokenPrice> = {}

      // Преобразуем ответ API в нужный формат
      validSymbols.forEach(symbol => {
        const tokenId = TOKEN_ID_MAP[symbol]
        const tokenData = data[tokenId]
        
        if (tokenData) {
          const priceData: TokenPrice = {
            price: tokenData.usd,
            change24h: tokenData.usd_24h_change,
            lastUpdated: Date.now()
          }
          
          results[symbol] = priceData
          // Обновляем кэш
          this.cache[tokenId] = priceData
        }
      })

      return results
    } catch (error) {
      console.error('Ошибка получения цен:', error)
      
      // Возвращаем fallback цены
      const fallbackResults: Record<string, TokenPrice> = {}
      symbols.forEach(symbol => {
        if (this.FALLBACK_PRICES[symbol]) {
          fallbackResults[symbol] = {
            price: this.FALLBACK_PRICES[symbol],
            change24h: 0,
            lastUpdated: Date.now()
          }
        }
      })
      
      return fallbackResults
    }
  }

  /**
   * Рассчитать курс обмена между двумя токенами
   * @param fromSymbol - из какого токена
   * @param toSymbol - в какой токен  
   * @param amount - количество исходного токена
   * @returns количество целевого токена
   */
  static async calculateExchangeRate(
    fromSymbol: string, 
    toSymbol: string, 
    amount: string
  ): Promise<string> {
    try {
      const prices = await this.getMultipleTokenPrices([fromSymbol, toSymbol])
      
      const fromPrice = prices[fromSymbol]?.price || this.FALLBACK_PRICES[fromSymbol] || 1
      const toPrice = prices[toSymbol]?.price || this.FALLBACK_PRICES[toSymbol] || 1
      
      const usdValue = Number(amount) * fromPrice
      const outputAmount = usdValue / toPrice
      
      // Ограничиваем до разумного количества знаков после запятой
      const decimals = toPrice < 1 ? 8 : toPrice < 100 ? 6 : 4
      return outputAmount.toFixed(decimals)
    } catch (error) {
      console.error('Ошибка расчета курса обмена:', error)
      return '0'
    }
  }

  /**
   * Очистить кэш цен (для принудительного обновления)
   */
  static clearPriceCache(): void {
    this.cache = {}
  }

  /**
   * Получить информацию о кэше (для отладки)
   */
  static getCacheInfo(): { size: number, tokens: string[] } {
    return {
      size: Object.keys(this.cache).length,
      tokens: Object.keys(this.cache)
    }
  }

  /**
   * Проверить, поддерживается ли токен
   */
  static isSupportedToken(symbol: string): boolean {
    return symbol in TOKEN_ID_MAP
  }

  /**
   * Получить список всех поддерживаемых токенов
   */
  static getSupportedTokens(): string[] {
    return Object.keys(TOKEN_ID_MAP)
  }
}

// Экспортируем типы для использования в компонентах
export type { TokenPrice, PriceCache }