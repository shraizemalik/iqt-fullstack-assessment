export function StatusBadge({ isCompleted }) {
  return (
    <span className={`status-badge ${isCompleted ? 'status-badge--completed' : 'status-badge--pending'}`}>
      {isCompleted ? 'Completed' : 'Pending'}
    </span>
  )
}
