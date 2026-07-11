import { TaskCard } from './TaskCard'

export function TaskList({ tasks, onDelete, onEdit, onToggleStatus, updatingTaskId }) {
  return (
    <section className="task-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
          isUpdating={updatingTaskId === task.id}
        />
      ))}
    </section>
  )
}
