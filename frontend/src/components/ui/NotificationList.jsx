export function NotificationList({ notifications, onDismiss }) {
  return (
    <div className="notification-stack" aria-live="polite" aria-atomic="true">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification--${notification.type}`}
        >
          <div>
            <strong>{notification.title}</strong>
            {notification.message ? <p>{notification.message}</p> : null}
          </div>
          <button type="button" onClick={() => onDismiss(notification.id)} aria-label="Dismiss notification">
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
