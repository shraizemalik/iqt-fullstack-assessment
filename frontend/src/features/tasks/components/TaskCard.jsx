import { Button } from '../../../components/ui/Button'
import { StatusBadge } from '../../../components/ui/StatusBadge'

export function TaskCard({ task, onDelete, onEdit, onToggleStatus, isUpdating }) {
  return (
    <article className="task-card">
      <div className="task-card__header">
        <div>
          <StatusBadge isCompleted={task.is_completed} />
          <h3>{task.title}</h3>
        </div>
        <button
          type="button"
          className={`task-card__toggle${task.is_completed ? ' is-completed' : ''}`}
          onClick={() => onToggleStatus(task)}
          disabled={isUpdating}
          aria-label={task.is_completed ? 'Mark task as pending' : 'Mark task as completed'}
        >
          {task.is_completed ? '✓' : ''}
        </button>
      </div>
      <p className="task-card__description">
        {task.description || 'No description provided for this task.'}
      </p>
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
