export interface GasPrice {
  slow: number      
  standard: number  
  fast: number      
  instant: number   
  networkCongestion: 'low' | 'medium' | 'high'
  lastUpdated: number       
}

export interface GasEstimate {
  gasLimit: number    
  gasPrice: number    
  totalCost: string   
  usdCost?: string    
}

export class GasService {
  private static cache: GasPrice | null = null
  private static readonly CACHE_DURATION = 30 * 1000 // 30 секунд

  // API который точно работает с CORS
  private static readonly WORKING_API = {
    name: 'CoinGecko Gas',
    url: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true',
    // Используем CoinGecko как источник для расчета базовых цен газа
  }
  private static readonly BASE_GAS_PRICES = {
    slow: 15,      // 15 Gwei
    standard: 25,  // 25 Gwei
    fast: 35,      // 35 Gwei
    instant: 45,   // 45 Gwei
  }

  /**
   * Получить текущие цены на газ
   */
  static async getCurrentGasPrices(): Promise<GasPrice> {
    // Проверяем кэш
    if (this.cache && Date.now() - this.cache.lastUpdated < this.CACHE_DURATION) {
      return this.cache
    }

    try {
      // Получаем данные о цене ETH для корректировки цен газа
      const response = await fetch(this.WORKING_API.url, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000)
      })

      if (response.ok) {
        const data = await response.json()
        const ethData = data.ethereum
        
        if (ethData) {
          // Корректируем цены газа на основе изменения цены ETH
          const priceChange24h = ethData.usd_24h_change || 0
          const multiplier = this.calculateGasMultiplier(priceChange24h)
          
          const gasData: GasPrice = {
            slow: Math.round(this.BASE_GAS_PRICES.slow * multiplier),
            standard: Math.round(this.BASE_GAS_PRICES.standard * multiplier),
            fast: Math.round(this.BASE_GAS_PRICES.fast * multiplier),
            instant: Math.round(this.BASE_GAS_PRICES.instant * multiplier),
            networkCongestion: this.calculateCongestion(this.BASE_GAS_PRICES.standard * multiplier),
            lastUpdated: Date.now()
          }

          this.cache = gasData
          console.log('✅ Gas prices calculated from ETH data:', gasData)
          return gasData
        }
      }
    } catch (error) {
      console.warn('Failed to fetch ETH data for gas calculation:', error)
    }

    // Fallback: используем базовые цены с временной корректировкой
    return this.getTimeBasedGasPrices()
  }

  /**
   * Расчет множителя газа на основе изменения цены ETH
   */
  private static calculateGasMultiplier(ethPriceChange24h: number): number {
    // Если ETH растет - газ дороже (больше активности)
    // Если ETH падает - газ дешевле (меньше активности)
    
    if (ethPriceChange24h > 10) return 1.5      // ETH +10%+ = газ дороже
    if (ethPriceChange24h > 5) return 1.3       // ETH +5%+ = газ немного дороже
    if (ethPriceChange24h > 0) return 1.1       // ETH растет = газ чуть дороже
    if (ethPriceChange24h > -5) return 1.0      // ETH стабилен = базовые цены
    if (ethPriceChange24h > -10) return 0.9     // ETH падает = газ дешевле
    return 0.8                                  // ETH сильно падает = газ дешевый
  }

  /**
   * Цены газа на основе времени суток
   */
  private static getTimeBasedGasPrices(): GasPrice {
    const currentHour = new Date().getUTCHours() // UTC время
    
    // Пиковые часы: 12:00-18:00 UTC (активность в Европе/США)
    const isPeakHours = currentHour >= 12 && currentHour <= 18
    
    const multiplier = isPeakHours ? 1.4 : 1.0
    
    const gasData: GasPrice = {
      slow: Math.round(this.BASE_GAS_PRICES.slow * multiplier),
      standard: Math.round(this.BASE_GAS_PRICES.standard * multiplier),
      fast: Math.round(this.BASE_GAS_PRICES.fast * multiplier),
      instant: Math.round(this.BASE_GAS_PRICES.instant * multiplier),
      networkCongestion: isPeakHours ? 'medium' : 'low',
      lastUpdated: Date.now()
    }

    this.cache = gasData
    console.log(`⏰ Time-based gas prices (${isPeakHours ? 'peak' : 'off-peak'}):`, gasData)
    return gasData
  }

  /**
   * Определение загруженности сети
   */
  private static calculateCongestion(standardPrice: number): GasPrice['networkCongestion'] {
    if (standardPrice < 20) return 'low'    
    if (standardPrice < 40) return 'medium' 
    return 'high'                           
  }

  /**
   * Рассчитать стоимость транзакции
   */
  static async estimateTransactionCost(
    gasLimit: number,
    priority: 'slow' | 'standard' | 'fast' | 'instant' = 'standard'
  ): Promise<GasEstimate> {
    try {
      const gasPrices = await this.getCurrentGasPrices()
      const gasPrice = gasPrices[priority]
      
      // Переводим в Wei (1 Gwei = 10^9 Wei)
      const gasPriceWei = gasPrice * 1e9
      const totalCostWei = BigInt(gasLimit) * BigInt(Math.floor(gasPriceWei))
      
      // Переводим в ETH (1 ETH = 10^18 Wei)
      const totalCostEth = Number(totalCostWei) / 1e18
      
      return {
        gasLimit,
        gasPrice,
        totalCost: totalCostEth.toFixed(6),
      }
    } catch (error) {
      console.error('Gas estimation failed:', error)
      
      // Fallback расчет
      const fallbackGasPrice = this.BASE_GAS_PRICES[priority]
      const totalCostEth = (gasLimit * fallbackGasPrice * 1e9) / 1e18
      
      return {
        gasLimit,
        gasPrice: fallbackGasPrice,
        totalCost: totalCostEth.toFixed(6)
      }
    }
  }

  /**
   * Получить лимиты газа для операций
   */
  static getGasLimits(): Record<string, number> {
    return {
      'ETH_transfer': 21000,        
      'ERC20_transfer': 65000,      
      'ERC20_approve': 45000,       
      'swap_simple': 150000,        
      'swap_complex': 300000,       
      'add_liquidity': 200000,      
      'remove_liquidity': 180000    
    }
  }

  /**
   * Форматирование
   */
  static formatGasPrice(gwei: number): string {
    return `${gwei.toFixed(0)} gwei`
  }

  static formatGasCost(ethCost: string, usdPrice?: number): string {
    const cost = `${ethCost} ETH`
    if (usdPrice) {
      const usdCost = (Number(ethCost) * usdPrice).toFixed(2)
      return `${cost} (~$${usdCost})`
    }
    return cost
  }

  /**
   * Очистить кэш
   */
  static clearCache(): void {
    this.cache = null
  }
}