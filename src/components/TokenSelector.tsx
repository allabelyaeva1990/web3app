// components/TokenSelector.tsx
import { useState, useCallback, useMemo } from 'react'
import { getAddress } from 'viem' // ✅ Добавляем импорт для валидации
import type { Token } from '../store/atoms'
import { POPULAR_TOKENS } from '../constants/tokens'
import { useTokenInfo } from '../hooks/useTokenInfo'

interface TokenSelectorProps {
  selectedToken: Token
  onTokenChange: (token: Token) => void
  label: string
  excludeToken?: Token // Исключить из списка (например, уже выбранный в паре)
}

export function TokenSelector({ 
  selectedToken, 
  onTokenChange, 
  label,
  excludeToken 
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customAddress, setCustomAddress] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Получаем данные пользовательского токена с валидацией
  const validatedAddress = useMemo(() => {
    if (customAddress.length !== 42) return undefined
    
    try {
      return getAddress(customAddress) // ✅ Исправляем checksum автоматически
    } catch {
      return undefined
    }
  }, [customAddress])

  const { data: customTokenInfo, isLoading: isLoadingCustom } = useTokenInfo(validatedAddress)

  // Фильтруем токены по поисковому запросу
  const filteredTokens = POPULAR_TOKENS.filter(token => {
    const matchesSearch = !searchQuery || 
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const notExcluded = !excludeToken || token.address !== excludeToken.address
    
    return matchesSearch && notExcluded
  })

  // Обработчик добавления пользовательского токена
  const handleCustomTokenAdd = useCallback(() => {
    if (customTokenInfo && validatedAddress) { // ✅ Используем validatedAddress
      const customToken: Token = {
        address: validatedAddress, // ✅ Используем исправленный адрес
        name: customTokenInfo.name,
        symbol: customTokenInfo.symbol,
        decimals: customTokenInfo.decimals
      }
      
      onTokenChange(customToken)
      setCustomAddress('')
      setSearchQuery('')
      setIsOpen(false)
    }
  }, [customTokenInfo, validatedAddress, onTokenChange])

  // Обработчик выбора токена из списка
  const handleTokenSelect = useCallback((token: Token) => {
    onTokenChange(token)
    setSearchQuery('')
    setIsOpen(false)
  }, [onTokenChange])

  return (
    <div style={{ position: 'relative' }}>
      {/* Кнопка выбора токена */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = '#007bff'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = '#ddd'
        }}
      >
        {selectedToken.logoURI && (
          <img 
            src={selectedToken.logoURI} 
            alt={selectedToken.symbol}
            style={{ width: '20px', height: '20px', borderRadius: '50%' }}
            onError={(e) => {
              // Скрываем изображение если не загрузилось
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
        <span>{selectedToken.symbol}</span>
        <span style={{ color: '#666' }}>↓</span>
      </button>

      {/* Модальное окно выбора */}
      {isOpen && (
        <>
          {/* Overlay для закрытия при клике вне */}
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.1)',
              zIndex: 999
            }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Само окно выбора */}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '12px',
            zIndex: 1000,
            maxHeight: '400px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            minWidth: '300px'
          }}>
            {/* Заголовок */}
            <div style={{ 
              padding: '16px', 
              borderBottom: '1px solid #eee',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              {label}
            </div>
            
            {/* Поиск */}
            <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
              <input
                type="text"
                placeholder="Поиск по названию или символу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                autoFocus
              />
            </div>
            
            {/* Список популярных токенов */}
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {filteredTokens.map(token => (
                <button
                  key={token.address}
                  onClick={() => handleTokenSelect(token)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor: selectedToken.address === token.address ? '#f0f8ff' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (selectedToken.address !== token.address) {
                      e.currentTarget.style.backgroundColor = '#f8f9fa'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedToken.address !== token.address) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  {token.logoURI && (
                    <img 
                      src={token.logoURI} 
                      alt={token.symbol}
                      style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      {token.symbol}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {token.name}
                    </div>
                  </div>
                  {selectedToken.address === token.address && (
                    <span style={{ color: '#007bff' }}>✓</span>
                  )}
                </button>
              ))}
              
              {filteredTokens.length === 0 && searchQuery && (
                <div style={{ 
                  padding: '20px', 
                  textAlign: 'center', 
                  color: '#666',
                  fontSize: '14px'
                }}>
                  Токены не найдены
                </div>
              )}
            </div>

            {/* Добавление пользовательского токена */}
            <div style={{ padding: '16px', borderTop: '1px solid #eee' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                Добавить токен по адресу:
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="0x... (адрес контракта)"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleCustomTokenAdd}
                  disabled={!customTokenInfo || isLoadingCustom}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: customTokenInfo ? '#007bff' : '#ccc',
                    color: 'white',
                    cursor: customTokenInfo ? 'pointer' : 'not-allowed',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    minWidth: '80px'
                  }}
                >
                  {isLoadingCustom ? '⏳' : 'Добавить'}
                </button>
              </div>
              
              {/* Информация о найденном токене */}
              {customTokenInfo && customAddress && (
                <div style={{ 
                  marginTop: '8px', 
                  padding: '8px', 
                  backgroundColor: '#f0f8ff',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}>
                  <div><strong>Найден:</strong> {customTokenInfo.name}</div>
                  <div><strong>Символ:</strong> {customTokenInfo.symbol}</div>
                  <div><strong>Decimals:</strong> {customTokenInfo.decimals}</div>
                </div>
              )}
              
              {/* Ошибка если адрес неверный */}
              {customAddress && customAddress.length === 42 && !customTokenInfo && !isLoadingCustom && (
                <div style={{ 
                  marginTop: '8px', 
                  padding: '8px', 
                  backgroundColor: '#fff3cd',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#856404'
                }}>
                  ⚠️ Токен не найден или это не ERC20 контракт
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}