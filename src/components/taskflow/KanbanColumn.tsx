import { workflowStatusLabels } from '../../types/task'
import type { Task, WorkflowStatus } from '../../types/task'
import { TaskCard } from './TaskCard'

type KanbanColumnProps = {
  onDeleteTask: (taskId: string) => void
  onEditTask: (task: Task, trigger?: HTMLButtonElement | null) => void
  onOpenTask: (task: Task, trigger?: HTMLButtonElement | null) => void
  onStatusChange: (taskId: string, status: WorkflowStatus) => void
  onSubtaskToggle: (taskId: string, subtaskId: string) => void
  status: WorkflowStatus
  tasks: Task[]
}

export function KanbanColumn({
  onDeleteTask,
  onEditTask,
  onOpenTask,
  onStatusChange,
  onSubtaskToggle,
  status,
  tasks,
}: KanbanColumnProps) {
  return (
    <section className="kanban-column">
      <header>
        <h3>{workflowStatusLabels[status]}</h3>
        <span>{tasks.length}</span>
      </header>

      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskCard
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
                onOpenTask={onOpenTask}
                onStatusChange={onStatusChange}
                onSubtaskToggle={onSubtaskToggle}
                task={task}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="column-empty">No tasks in this stage.</p>
      )}
    </section>
  )
}
