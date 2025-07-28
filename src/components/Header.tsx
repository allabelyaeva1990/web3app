// src/components/Header.tsx - Обновленный с навигацией
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { useWeb3Connection } from '../hooks'

export function Header() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const { address, isConnected } = useAccount()
  const { handleConnect, handleDisconnect } = useWeb3Connection()
  // Функция для переключения языка
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ru' : 'en'
    i18n.changeLanguage(newLang)
  }

  // Стили для активной ссылки
  const isActiveLink = (path: string) => location.pathname === path

  const linkStyle = (isActive: boolean) => ({
    padding: '8px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px',
    color: isActive ? '#007bff' : '#666',
    backgroundColor: isActive ? '#f0f8ff' : 'transparent',
    border: isActive ? '1px solid #007bff' : '1px solid transparent',
    transition: 'all 0.2s',
  })

  return (
    <header style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e1e5e9',
      padding: '0 20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px'
      }}>
        
        {/* Логотип и название */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link 
            to="/" 
            style={{ 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🦄
            </div>
            <span style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              DexSwap
            </span>
          </Link>
        </div>

        {/* Навигационное меню */}
        <nav style={{ display: 'flex', gap: '8px' }}>
          <Link 
            to="/" 
            style={linkStyle(isActiveLink('/'))}
          >
            🔄 {t('swap')}
          </Link>
          
          <Link 
            to="/buy" 
            style={linkStyle(isActiveLink('/buy'))}
          >
            💰 Покупка
          </Link>
          
          <Link 
            to="/sell" 
            style={linkStyle(isActiveLink('/sell'))}
          >
            💸 Продажа
          </Link>
          
          <Link 
            to="/transactions" 
            style={linkStyle(isActiveLink('/transactions'))}
          >
            📜 Транзакции
          </Link>
        </nav>

        {/* Правая часть с кнопками */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Переключатель языка */}
          <button
            onClick={toggleLanguage}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              color: '#666'
            }}
          >
            {i18n.language === 'en' ? '🇷🇺 RU' : '🇺🇸 EN'}
          </button>

          {/* Кнопка подключения кошелька */}
          {isConnected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px 12px',
                backgroundColor: '#f0f8ff',
                border: '1px solid #007bff',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#007bff'
              }}>
                🔗 {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
              <button
                onClick={() => handleDisconnect()}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #dc3545',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#dc3545',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                Отключить
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#007bff',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#0056b3'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#007bff'
              }}
            >
              {t('connectWallet')}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}