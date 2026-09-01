import { Sparkles } from 'lucide-react'
import {
  departmentLabels,
  priorityLabels,
  workflowStatusLabels,
  workflowStatuses,
} from '../../types/task'
import type { Task, WorkflowStatus } from '../../types/task'
import { isTaskOverdue } from '../../utils/taskAnalytics'
import { getSubtaskProgress } from '../../utils/taskTransforms'

type TaskCardProps = {
  onDeleteTask: (taskId: string) => void
  onEditTask: (task: Task, trigger?: HTMLButtonElement | null) => void
  onOpenTask: (task: Task, trigger?: HTMLButtonElement | null) => void
  onStatusChange: (taskId: string, status: WorkflowStatus) => void
  onSubtaskToggle: (taskId: string, subtaskId: string) => void
  task: Task
}

export function TaskCard({
  onDeleteTask,
  onEditTask,
  onOpenTask,
  onStatusChange,
  onSubtaskToggle,
  task,
}: TaskCardProps) {
  const progress = getSubtaskProgress(task.subtasks)
  const overdue = isTaskOverdue(task)

  return (
    <article className={`task-card priority-${task.priority}`}>
      <button
        className="task-card-title"
        onClick={(event) => onOpenTask(task, event.currentTarget)}
        type="button"
      >
        {task.title}
      </button>
      {task.description ? <p>{task.description}</p> : null}

      <div className="task-badges" aria-label="Task metadata">
        <span className={`priority-badge ${task.priority}`}>
          {priorityLabels[task.priority]}
        </span>
        <span>{departmentLabels[task.department]}</span>
        {task.aiAssisted ? (
          <span>
            <Sparkles aria-hidden="true" size={13} />
            AI assisted
          </span>
        ) : null}
      </div>

      {task.labels.length > 0 ? (
        <div className="label-list" aria-label="Labels">
          {task.labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      ) : null}

      <div className="task-card-footer">
        <span className={overdue ? 'due-date overdue' : 'due-date'}>
          {task.dueDate ? `Due ${task.dueDate}` : 'No due date'}
        </span>
        <span>{task.assignee || 'Unassigned'}</span>
      </div>

      <div className="subtask-progress">
        <span>
          {progress.completed}/{progress.total} subtasks
        </span>
        <progress
          aria-label={`${task.title} subtask progress`}
          max={progress.total || 1}
          value={progress.completed}
        />
      </div>

      {task.subtasks.length > 0 ? (
        <ul className="mini-subtasks" aria-label={`${task.title} subtasks`}>
          {task.subtasks.slice(0, 3).map((subtask) => (
            <li key={subtask.id}>
              <label>
                <input
                  checked={subtask.completed}
                  onChange={() => onSubtaskToggle(task.id, subtask.id)}
                  type="checkbox"
                />
                <span>{subtask.title}</span>
              </label>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="card-actions">
        <label>
          <span className="sr-only">Move {task.title} to status</span>
          <select
            aria-label={`Move ${task.title} to status`}
            onChange={(event) =>
              onStatusChange(task.id, event.target.value as WorkflowStatus)
            }
            value={task.status}
          >
            {workflowStatuses.map((status) => (
              <option key={status} value={status}>
                {workflowStatusLabels[status]}
              </option>
            ))}
          </select>
        </label>
        <button
          className="text-action"
          onClick={(event) => onEditTask(task, event.currentTarget)}
          type="button"
        >
          Edit
        </button>
        <button
          className="text-action danger"
          onClick={() => onDeleteTask(task.id)}
          type="button"
        >
          Delete
        </button>
      </div>
    </article>
  )
}
