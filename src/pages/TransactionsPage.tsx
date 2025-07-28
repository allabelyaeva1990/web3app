import React, { useState } from 'react'
import { 
  PageHeader,
  StatCard,
  FilterPanel,
  EmptyState,
  TransactionCard,
  type FilterType,
  type SortType
} from '../components/ui'
import { 
  useTransactionManager,
  useWeb3Connection,
  useAppLocalization 
} from '../hooks'

export const TransactionsPage = React.memo(function TransactionsPage() {
  const { t } = useAppLocalization()
  const { isConnected } = useWeb3Connection()
  
  const {
    // Данные
    stats,
    hasTransactions,
    
    // Методы
    getFilteredHistory,
    clearHistory,
  } = useTransactionManager()
  
  // Локальное состояние фильтров
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('newest')

  // Получаем отфильтрованную историю
  const filteredHistory = getFilteredHistory(filter, sortBy)

  // Рендер списка транзакций
  const renderTransactionsList = () => {
    if (!isConnected) {
      return (
        <EmptyState
          icon="🔐"
          title={t('walletNotConnected')}
          subtitle={t('connectToView')}
        />
      )
    }

    if (filteredHistory.length === 0) {
      const isFiltered = filter !== 'all'
      return (
        <EmptyState
          icon="📭"
          title={isFiltered ? t('noTransactionsWithFilter', { filter }) : t('noTransactions')}
          subtitle={
            isFiltered 
              ? t('changeFilter')
              : t('firstTransaction')
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
        title={t('transactionHistory')}
        subtitle={t('historyDescription')}
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
          label={t('total')} 
          color="#007bff" 
        />
        <StatCard 
          value={stats.pending} 
          label={t('pending')} 
          color="#ffc107" 
        />
        <StatCard 
          value={stats.success} 
          label={t('success')} 
          color="#28a745" 
        />
        <StatCard 
          value={stats.failed} 
          label={t('failed')} 
          color="#dc3545" 
        />
      </div>

      <FilterPanel
        currentFilter={filter}
        onFilterChange={setFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClear={hasTransactions ? clearHistory : undefined}
        hasData={hasTransactions}
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
          💡 <strong>{t('aboutTransactionHistory')}</strong>
        </div>
        <div>
          {t('historyStoredLocally')}
        </div>
      </div>
    </div>
  )
})