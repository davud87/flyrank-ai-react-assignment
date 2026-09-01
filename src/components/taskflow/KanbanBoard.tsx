import { workflowStatuses } from '../../types/task'
import type { Task, WorkflowStatus } from '../../types/task'
import { KanbanColumn } from './KanbanColumn'

type KanbanBoardProps = {
  onDeleteTask: (taskId: string) => void
  onEditTask: (task: Task, trigger?: HTMLButtonElement | null) => void
  onOpenTask: (task: Task, trigger?: HTMLButtonElement | null) => void
  onStatusChange: (taskId: string, status: WorkflowStatus) => void
  onSubtaskToggle: (taskId: string, subtaskId: string) => void
  tasks: Task[]
  totalTasks: number
}

export function KanbanBoard({
  onDeleteTask,
  onEditTask,
  onOpenTask,
  onStatusChange,
  onSubtaskToggle,
  tasks,
  totalTasks,
}: KanbanBoardProps) {
  if (tasks.length === 0) {
    return (
      <article className="empty-state">
        <p className="empty-title">
          {totalTasks === 0 ? 'No tasks yet' : 'No matching tasks'}
        </p>
        <p>
          {totalTasks === 0
            ? 'Create a task manually or use the AI planner to structure rough project work.'
            : 'Adjust filters or switch departments to find the work you need.'}
        </p>
      </article>
    )
  }

  return (
    <div className="kanban-scroll" tabIndex={0}>
      <div className="kanban-board" aria-label="Task status columns">
        {workflowStatuses.map((status) => (
          <KanbanColumn
            key={status}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
            onOpenTask={onOpenTask}
            onStatusChange={onStatusChange}
            onSubtaskToggle={onSubtaskToggle}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
          />
        ))}
      </div>
    </div>
  )
}
