// src/hooks/useTransactionManager.ts - Управление историей транзакций
import { useCallback, useMemo } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { 
  transactionsHistoryAtom, 
  addTransactionsHistoryAtom,
  updateTransactionsHistoryAtom,
  type TransationsHistory 
} from '../store/atoms'

type FilterType = 'all' | 'pending' | 'success' | 'failed'
type SortType = 'newest' | 'oldest'

export function useTransactionManager() {
  const [history, setHistory] = useAtom(transactionsHistoryAtom)
  const addToHistory = useSetAtom(addTransactionsHistoryAtom)
  const updateTransaction = useSetAtom(updateTransactionsHistoryAtom)

  // Статистика
  const stats = useMemo(() => ({
    total: history.length,
    pending: history.filter(tx => tx.status === 'pending').length,
    success: history.filter(tx => tx.status === 'success').length,  
    failed: history.filter(tx => tx.status === 'failed').length,
  }), [history])

  // Фильтрация и сортировка
  const getFilteredHistory = useCallback((
    filter: FilterType = 'all',
    sortBy: SortType = 'newest'
  ) => {
    return history
      .filter(tx => filter === 'all' || tx.status === filter)
      .sort((a, b) => {
        if (sortBy === 'newest') return b.timestamp - a.timestamp
        return a.timestamp - b.timestamp
      })
  }, [history])

  // Определение типа операции 
  const getOperationType = useCallback((tx: TransationsHistory) => {
    if (tx.inputToken.symbol === 'ETH' && tx.outputToken.symbol !== 'ETH') {
      return { type: 'buy' as const, icon: '💰', label: 'Покупка' }
    }
    if (tx.inputToken.symbol !== 'ETH' && tx.outputToken.symbol === 'ETH') {
      return { type: 'sell' as const, icon: '💸', label: 'Продажа' }
    }
    return { type: 'swap' as const, icon: '🔄', label: 'Обмен' }
  }, [])

  // Стили для статусов
  const getStatusStyle = useCallback((status: TransationsHistory['status']) => {
    const styles = {
      pending: { color: '#ffc107', icon: '⏳', label: 'В ожидании' },
      success: { color: '#28a745', icon: '✅', label: 'Успешно' },
      failed: { color: '#dc3545', icon: '❌', label: 'Неудачно' }
    }
    return styles[status] || styles.pending
  }, [])

  // Форматирование даты 
  const formatDate = useCallback((timestamp: number, format: 'short' | 'full' = 'full') => {
    const date = new Date(timestamp)
    
    if (format === 'short') {
      const now = Date.now()
      const diff = now - timestamp
      
      if (diff < 60 * 1000) return 'Только что'
      if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}м назад`
      if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}ч назад`
      if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / (24 * 60 * 60 * 1000))}д назад`
    }
    
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }, [])

  // Расчет курса обмена
  const calculateExchangeRate = useCallback((tx: TransationsHistory) => {
    const rate = Number(tx.outputAmount) / Number(tx.inputAmount)
    return {
      rate: rate.toFixed(6),
      formatted: `1 ${tx.inputToken.symbol} = ${rate.toFixed(6)} ${tx.outputToken.symbol}`
    }
  }, [])

  // Очистка истории
  const clearHistory = useCallback(() => {
    if (window.confirm('Вы уверены, что хотите очистить всю историю транзакций?')) {
      setHistory([])
      return true
    }
    return false
  }, [setHistory])

  // Обновление статуса транзакции
  const updateTransactionStatus = useCallback((
    id: string, 
    status: TransationsHistory['status'],
    txHash?: string,
    gasUsed?: string
  ) => {
    updateTransaction({
      id,
      updates: { status, txHash, gasUsed }
    })
  }, [updateTransaction])

  // Добавление новой транзакции
  const addTransaction = useCallback((
    transaction: Omit<TransationsHistory, 'timestamp'>
  ) => {
    addToHistory(transaction)
  }, [addToHistory])

  // Поиск транзакции по ID
  const findTransaction = useCallback((id: string) => {
    return history.find(tx => tx.id === id)
  }, [history])

  // Получение транзакций по токену
  const getTransactionsByToken = useCallback((tokenSymbol: string) => {
    return history.filter(tx => 
      tx.inputToken.symbol === tokenSymbol || 
      tx.outputToken.symbol === tokenSymbol
    )
  }, [history])



  return {
    // 📊 Данные
    history,
    stats,
    
    // 🔍 Методы получения данных
    getFilteredHistory,
    findTransaction,
    getTransactionsByToken,
    
    // 🎨 Утилиты форматирования
    getOperationType,
    getStatusStyle,
    formatDate,
    calculateExchangeRate,
    
    // 🎬 Действия
    addTransaction,
    updateTransactionStatus,
    clearHistory,
    
    // 📏 Проверки
    hasTransactions: history.length > 0,
    isEmpty: history.length === 0
  }
}