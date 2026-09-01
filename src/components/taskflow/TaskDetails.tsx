import {
  departmentLabels,
  priorityLabels,
  workflowStatusLabels,
  workflowStatuses,
} from '../../types/task'
import type { Task, WorkflowStatus } from '../../types/task'
import { getSubtaskProgress } from '../../utils/taskTransforms'

type TaskDetailsProps = {
  onDeleteTask: (taskId: string) => void
  onEditTask: (event: React.MouseEvent<HTMLButtonElement>) => void
  onStatusChange: (taskId: string, status: WorkflowStatus) => void
  onSubtaskToggle: (taskId: string, subtaskId: string) => void
  task: Task
}

export function TaskDetails({
  onDeleteTask,
  onEditTask,
  onStatusChange,
  onSubtaskToggle,
  task,
}: TaskDetailsProps) {
  const progress = getSubtaskProgress(task.subtasks)

  return (
    <div className="task-detail">
      <div className="detail-summary">
        <h3>{task.title}</h3>
        <p>{task.description || 'No description provided.'}</p>
      </div>

      <dl className="detail-grid">
        <div>
          <dt>Status</dt>
          <dd>
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
          </dd>
        </div>
        <div>
          <dt>Department</dt>
          <dd>{departmentLabels[task.department]}</dd>
        </div>
        <div>
          <dt>Priority</dt>
          <dd>{priorityLabels[task.priority]}</dd>
        </div>
        <div>
          <dt>Due date</dt>
          <dd>{task.dueDate || 'Not set'}</dd>
        </div>
        <div>
          <dt>Assignee</dt>
          <dd>{task.assignee || 'Unassigned'}</dd>
        </div>
        <div>
          <dt>Subtasks</dt>
          <dd>
            {progress.completed}/{progress.total} complete
          </dd>
        </div>
      </dl>

      {task.labels.length > 0 ? (
        <div className="label-list detail-labels">
          {task.labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      ) : null}

      <section className="detail-subtasks" aria-labelledby="detail-subtasks">
        <h4 id="detail-subtasks">Subtasks</h4>
        {task.subtasks.length > 0 ? (
          <ul>
            {task.subtasks.map((subtask) => (
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
        ) : (
          <p className="muted-copy">No subtasks for this task.</p>
        )}
      </section>

      <div className="form-actions">
        <button className="secondary-action" onClick={onEditTask} type="button">
          Edit task
        </button>
        <button
          className="danger-action"
          onClick={() => onDeleteTask(task.id)}
          type="button"
        >
          Delete task
        </button>
      </div>
    </div>
  )
}
