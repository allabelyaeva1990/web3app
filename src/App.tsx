import { Routes, Route } from 'react-router-dom'
import { Header, NotificationContainer, ErrorBoundary } from './components'
import { SwapPage, SellPage, BuyPage, TransactionsPage } from './pages'

function App() {
  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Header />
        
        <main style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '20px',
          paddingTop: '40px'
        }}>
          <Routes>
            {/* 🏠 Главная страница - Swap */}
            <Route path="/" element={<SwapPage />} />
            
            {/* 💰 Страница покупки */}
            <Route path="/buy" element={<BuyPage />} />
            
            {/* 💸 Страница продажи */}
            <Route path="/sell" element={<SellPage />} />
            
            {/* 📜 Страница транзакций */}
            <Route path="/transactions" element={<TransactionsPage />} />
            
            {/* 🔄 Fallback на главную если роут не найден */}
            <Route path="*" element={<SwapPage />} />
          </Routes>
        </main>
        
        {/* 🔔 Контейнер для уведомлений */}
        <NotificationContainer />
        
        {/* 🛠️ Debug информация только в development */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            fontSize: '12px',
            color: '#666',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            zIndex: 1000
          }}>
            🛠️ Development Mode | Providers: ✅ | Routes: ✅
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App