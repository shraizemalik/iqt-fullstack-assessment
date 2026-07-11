import { Button } from '../../../components/ui/Button'
import { StatusBadge } from '../../../components/ui/StatusBadge'

export function TaskCard({ task, onDelete, onEdit, onToggleStatus, isUpdating }) {
  return (
    <article className={`task-card${task.is_completed ? ' task-card--completed' : ''}`}>
      <div className="task-card__header">
        <label className="task-card__status-control">
          <input
            type="checkbox"
            checked={task.is_completed}
            onChange={() => onToggleStatus(task)}
            disabled={isUpdating}
          />
          <span className="task-card__checkbox" aria-hidden="true">
            {task.is_completed ? '✓' : ''}
          </span>
          <span className="sr-only">
            {task.is_completed ? 'Mark task as pending' : 'Mark task as completed'}
          </span>
        </label>

        <div className="task-card__content">
          <StatusBadge isCompleted={task.is_completed} />
          <h3>{task.title}</h3>
          <p className="task-card__description">
            {task.description || 'No description provided for this task.'}
          </p>
        </div>
      </div>

      <footer className="task-card__footer">
        <small>Updated {new Date(task.updated_at).toLocaleString()}</small>
        <div className="task-card__actions">
          <Button variant="ghost" onClick={() => onEdit(task)}>
            Edit
          </Button>
          <Button variant="secondary" onClick={() => onToggleStatus(task)} disabled={isUpdating}>
            {task.is_completed ? 'Mark pending' : 'Mark complete'}
          </Button>
          <Button variant="danger" onClick={() => onDelete(task)}>
            Delete
          </Button>
        </div>
      </footer>
    </article>
  )
}
