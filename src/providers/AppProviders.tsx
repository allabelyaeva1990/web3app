// src/providers/AppProviders.tsx
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { config } from '../utils/wagmi'
import i18n from '../i18n/config'

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 секунд, как долго данные считаются "свежими"
      gcTime: 5 * 60 * 1000, // 5 минут, когда удалять из памяти
      
      // 🔁 Retry логика для нестабильных RPC соединений
      retry: (failureCount, error) => {
        // Не повторяем для 4xx ошибок (как HTTP interceptor в Angular)
        if (error && 'status' in error && typeof error.status === 'number' && error.status >= 400 && error.status < 500) {
            return false;
        }
        return failureCount < 3
      },
      // 🎯 Обновляем данные при фокусе
      refetchOnWindowFocus: true,
      // 🌐 Обновляем при переподключении к сети
      refetchOnReconnect: true,
    },
    mutations: {
      // 💸 Транзакции не повторяем - они необратимы!
      retry: false,
    },
  },
})

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  // 🏭 Создаем QueryClient только один раз при монтировании компонента
  const queryClient = React.useMemo(() => createQueryClient(), [])
  
  // 🎭 Композиция провайдеров (порядок ВАЖЕН!)
  // 1️⃣ WagmiProvider - самый внешний (предоставляет Web3 контекст)
  // 2️⃣ QueryClientProvider - кэширование данных
  // 3️⃣ I18nextProvider - локализация
  // 4️⃣ BrowserRouter - роутинг
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </I18nextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// 🔍 ОТЛАДОЧНАЯ ИНФОРМАЦИЯ (только в development)
export function AppProvidersWithDevtools({ children }: AppProvidersProps) {
  const queryClient = React.useMemo(() => createQueryClient(), [])
  
  // 🛠️ Lazy loading DevTools (только если установлены)
  const ReactQueryDevtools = React.useMemo(() => {
    if (process.env.NODE_ENV !== 'development') return null
    
    try {
      // Dynamic import - загружаем только в development
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ReactQueryDevtools } = require('@tanstack/react-query-devtools')
      return ReactQueryDevtools
    } catch {
      console.warn('React Query DevTools не установлены')
      return null
    }
  }, [])
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            {children}
            
            {/* 🔧 DevTools только в development */}
            {ReactQueryDevtools && (
              <ReactQueryDevtools 
                initialIsOpen={false}
                buttonPosition="bottom-left"
              />
            )}
          </BrowserRouter>
        </I18nextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default process.env.NODE_ENV === 'development' 
  ? AppProvidersWithDevtools 
  : AppProviders