import { useSetAtom } from "jotai"
import { useCallback } from "react"
import { 
  addNotificationAtom
} from '../store/atoms'

export function useNotifications() {
  const addNotification = useSetAtom(addNotificationAtom)
  
  // Предустановленные типы уведомлений
  const showSuccess = useCallback((title: string, message: string, duration = 5000) => {
    addNotification({ type: 'success', title, message, duration })
  }, [addNotification])
  
  const showError = useCallback((title: string, message: string, duration = 8000) => {
    addNotification({ type: 'error', title, message, duration })
  }, [addNotification])
  
  const showWarning = useCallback((title: string, message: string, duration = 6000) => {
    addNotification({ type: 'warning', title, message, duration })
  }, [addNotification])
  
  const showInfo = useCallback((title: string, message: string, duration = 4000) => {
    addNotification({ type: 'info', title, message, duration })
  }, [addNotification])
  
  // Специальные уведомления для Web3
  const showTransactionSent = useCallback((txHash: string) => {
    addNotification({
      type: 'info',
      title: '📤 Транзакция отправлена',
      message: `TxHash: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
      duration: 10000,
    })
  }, [addNotification])
  
  const showWalletConnected = useCallback((address: string) => {
    addNotification({
      type: 'success',
      title: '🔗 Кошелек подключен',
      message: `${address.slice(0, 6)}...${address.slice(-4)}`,
      duration: 3000
    })
  }, [addNotification])

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showTransactionSent,
    showWalletConnected
  }
}