// components/NotificationContainer.tsx
import { useAtomValue, useSetAtom } from 'jotai'
import { notificationsAtom, removeNotificationAtom, type Notification } from '../store/atoms'

function NotificationItem({ notification }: { notification: Notification }) {
  const removeNotification = useSetAtom(removeNotificationAtom)

  const getNotificationStyle = (type: Notification['type']) => {
    const baseStyle = {
      padding: '16px',
      marginBottom: '12px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid',
      position: 'relative' as const,
      overflow: 'hidden' as const,
    }

    switch (type) {
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: '#d4edda',
          borderColor: '#c3e6cb',
          color: '#155724'
        }
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: '#f8d7da',
          borderColor: '#f5c6cb',
          color: '#721c24'
        }
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: '#fff3cd',
          borderColor: '#ffeaa7',
          color: '#856404'
        }
      case 'info':
      default:
        return {
          ...baseStyle,
          backgroundColor: '#d1ecf1',
          borderColor: '#bee5eb',
          color: '#0c5460'
        }
    }
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return 'ℹ️'
    }
  }

  return (
    <div
      style={getNotificationStyle(notification.type)}
      onClick={() => removeNotification(notification.id)}
    >
      {/* Автоматический прогресс-бар для уведомлений с duration */}
      {notification.duration && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '3px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            animation: `shrink ${notification.duration}ms linear`,
            width: '100%'
          }}
        />
      )}
      
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{ fontSize: '20px', flexShrink: 0 }}>
          {getIcon(notification.type)}
        </span>
        
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '14px', 
            marginBottom: '4px' 
          }}>
            {notification.title}
          </div>
          <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
            {notification.message}
          </div>
          <div style={{ 
            fontSize: '10px', 
            opacity: 0.7, 
            marginTop: '8px' 
          }}>
            {new Date(notification.timestamp).toLocaleTimeString()}
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            removeNotification(notification.id)
          }}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            opacity: 0.5,
            padding: '4px'
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export function NotificationContainer() {
  const notifications = useAtomValue(notificationsAtom)

  if (notifications.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 10000,
      maxWidth: '400px',
      width: '100%'
    }}>
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
        />
      ))}
      
      {/* Показываем количество уведомлений если их много */}
      {notifications.length > 3 && (
        <div style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#666',
          marginTop: '8px'
        }}>
          +{notifications.length - 3} еще уведомлений
        </div>
      )}
    </div>
  )
}