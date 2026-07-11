import { useCallback, useEffect, useState } from 'react'

let notificationId = 0

export function useNotifications() {
  const [notifications, setNotifications] = useState([])

  const dismissNotification = useCallback((id) => {
    setNotifications((current) => current.filter((notification) => notification.id !== id))
  }, [])

  const pushNotification = useCallback((notification) => {
    notificationId += 1

    const entry = {
      id: notificationId,
      type: notification.type ?? 'success',
      title: notification.title,
      message: notification.message ?? '',
    }

    setNotifications((current) => [...current, entry])
  }, [])

  useEffect(() => {
    if (notifications.length === 0) {
      return undefined
    }

    const timers = notifications.map((notification) =>
      window.setTimeout(() => {
        dismissNotification(notification.id)
      }, 3500),
    )

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [dismissNotification, notifications])

  return {
    notifications,
    dismissNotification,
    pushNotification,
  }
}
