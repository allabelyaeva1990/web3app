import { useAtom } from 'jotai'
import { useMemo, useState } from 'react'
import { transactionsHistoryAtom } from '../store/atoms'
import { EmptyState, FilterPanel, PageHeader, StatCard, TransactionCard, type FilterType, type SortType } from '../components'
import { useAccount } from 'wagmi'

export function TransactionsPage() {
  const { address } = useAccount()
  const [filter, setFilter] = useState<FilterType>('all')
  const [history, setHistory] = useAtom(transactionsHistoryAtom)
  const [sortBy, setSortBy] = useState<SortType>('newest')

  // Статистика
  const stats = {
    total: history.length,
    pending: history.filter(tx => tx.status === 'pending').length,
    success: history.filter(tx => tx.status === 'success').length,
    failed: history.filter(tx => tx.status === 'failed').length,
  }

  const handleClearHistory = () => {
    if (window.confirm('Вы уверены, что хотите очистить всю историю транзакций?')) {
      setHistory([])
    }
  }

  const filteredHistory = useMemo(() => {
    return history
      .filter(tx => filter === 'all' || tx.status === filter)
      .sort((a, b) => {
        if (sortBy === 'newest') return b.timestamp - a.timestamp
        return a.timestamp - b.timestamp
      })
  }, [history, filter, sortBy])

  const renderTransactionsList = () => {
    if (!address) {
      return (
        <EmptyState
          icon="🔐"
          title="Кошелек не подключен"
          subtitle="Подключите кошелек для просмотра истории транзакций"
        />
      )
    }

    if (filteredHistory.length === 0) {
      const isFiltered = filter !== 'all'
      return (
        <EmptyState
          icon="📭"
          title={isFiltered ? `Нет транзакций со статусом "${filter}"` : 'Нет транзакций'}
          subtitle={
            isFiltered 
              ? 'Попробуйте изменить фильтр или совершите новую операцию'
              : 'Совершите первую операцию обмена, покупки или продажи'
          }
        />
      )
    }

    return filteredHistory.map((tx, index) => (
      <TransactionCard
        key={tx.id}
        transaction={tx}
        isLast={index === filteredHistory.length - 1}
      />
    ))
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      <PageHeader 
        title="История транзакций"
        subtitle="Все ваши операции обмена, покупки и продажи"
        icon="📜"
        gradient="linear-gradient(135deg, #6f42c1 0%, #007bff 100%)"
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <StatCard 
          value={stats.total} 
          label="Всего" 
          color="#007bff" 
        />
        <StatCard 
          value={stats.pending} 
          label="В ожидании" 
          color="#ffc107" 
        />
        <StatCard 
          value={stats.success} 
          label="Успешно" 
          color="#28a745" 
        />
        <StatCard 
          value={stats.failed} 
          label="Неудачно" 
          color="#dc3545" 
        />
      </div>

      <FilterPanel
        currentFilter={filter}
        onFilterChange={(newFilter) => setFilter(newFilter)}
        sortBy={sortBy}
        onSortChange={(newSort) => setSortBy(newSort)}
        onClear={handleClearHistory}
        hasData={history.length > 0}
      />

      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: '1px solid #e1e5e9',
        overflow: 'hidden'
      }}>
        {renderTransactionsList()}
      </div>

      <div style={{ 
        marginTop: '24px', 
        fontSize: '12px', 
        color: '#999', 
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        padding: '16px',
        borderRadius: '12px'
      }}>
        <div style={{ marginBottom: '8px' }}>
          💡 <strong>О истории транзакций:</strong>
        </div>
        <div>
          История сохраняется локально в вашем браузере. 
          Данные не передаются на сервер и доступны только вам.
        </div>
      </div>
    </div>
  )
}