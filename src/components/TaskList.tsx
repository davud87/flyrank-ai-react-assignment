import type { Priority, Task } from '../types/task'

const priorityLabels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

type TaskListProps = {
  tasks: Task[]
  totalTaskCount: number
  editingTaskId: string | null
  onDeleteTask: (taskId: string) => void
  onEditTask: (taskId: string) => void
  onToggleTask: (taskId: string) => void
}

export function TaskList({
  tasks,
  totalTaskCount,
  editingTaskId,
  onDeleteTask,
  onEditTask,
  onToggleTask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <section className="task-list" aria-label="Task list">
        <article className="empty-state">
          <p className="empty-title">
            {totalTaskCount === 0 ? 'No tasks yet' : 'No matching tasks'}
          </p>
          <p>
            {totalTaskCount === 0
              ? 'Add your first task to start organizing your day.'
              : 'Try adjusting your search or switching to another status filter.'}
          </p>
        </article>
      </section>
    )
  }

  return (
    <section className="task-list" aria-label="Task list">
      <ul className="task-items">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={task.completed ? 'task-item completed' : 'task-item'}
          >
            <div className="task-item-main">
              <label className="completion-control">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask(task.id)}
                />
                <span>
                  Mark as {task.completed ? 'active' : 'completed'}
                </span>
              </label>

              <div className="task-copy">
                <h3>{task.title}</h3>
                {task.description ? <p>{task.description}</p> : null}
              </div>
            </div>

            <div className="task-meta" aria-label="Task details">
              <span className={`priority-badge ${task.priority}`}>
                {priorityLabels[task.priority]} Priority
              </span>
              <span className="status-badge">
                {task.completed ? 'Completed' : 'Active'}
              </span>
            </div>

            <div className="task-actions">
              <button
                type="button"
                className="secondary-action compact"
                disabled={editingTaskId === task.id}
                onClick={() => onEditTask(task.id)}
              >
                {editingTaskId === task.id ? 'Editing' : 'Edit'}
              </button>
              <button
                type="button"
                className="danger-action compact"
                onClick={() => onDeleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
