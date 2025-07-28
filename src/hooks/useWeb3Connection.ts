// src/hooks/useWeb3Connection.ts - Управление подключением кошелька
import { useCallback, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useAppStore } from '../store/zustand-store'
import { useNotifications } from './useNotifications'

export function useWeb3Connection() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  const { connect, connectors, status: connectStatus } = useConnect()
  const { disconnect } = useDisconnect()
  const { autoConnect } = useAppStore(state => state.userPreferences)
  const { showError } = useNotifications()

  // Подключение кошелька
  const handleConnect = useCallback(async () => {
    try {
      const connector = connectors[0]
      if (connector) {
        await connect({ connector })
      } else {
        showError('Кошелек не найден', 'Установите MetaMask или другой Web3 кошелек')
      }
    } catch (error) {
      showError(
        'Ошибка подключения',
        error instanceof Error ? error.message : 'Не удалось подключить кошелек'
      )
    }
  }, [connect, connectors, showError])

  // Отключение кошелька
  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect()
    } catch (error) {
      showError(
        'Ошибка отключения',
        error instanceof Error ? error.message : 'Не удалось отключить кошелек'
      )
    }
  }, [disconnect, showError])

  // Автоподключение при загрузке
  useEffect(() => {
    if (autoConnect && !isConnected && !isConnecting && connectors.length > 0) {
      const savedConnector = connectors.find(c => c.id === localStorage.getItem('lastConnector'))
      const connector = savedConnector || connectors[0]
      
      if (connector) {
        connect({ connector })
      }
    }
  }, [autoConnect, isConnected, isConnecting, connectors, connect])

  // Сохраняем последний использованный коннектор
  useEffect(() => {
    if (isConnected && connectors.length > 0) {
      const activeConnector = connectors.find(c => c.id === address)
      if (activeConnector) {
        localStorage.setItem('lastConnector', activeConnector.id)
      }
    }
  }, [isConnected, connectors, address])

  // Состояние подключения
  const connectionState = {
    isConnected,
    isConnecting: isConnecting || isReconnecting,
    address,
    formattedAddress: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null,
    hasConnectors: connectors.length > 0,
    connectStatus
  }

  return {
    ...connectionState,
    handleConnect,
    handleDisconnect,
    connectors
  }
}