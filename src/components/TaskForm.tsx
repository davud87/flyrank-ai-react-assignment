import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  departmentLabels,
  departments,
  priorities,
  priorityLabels,
  workflowStatusLabels,
  workflowStatuses,
} from '../types/task'
import type { Subtask, TaskFormData } from '../types/task'

type TaskFormProps = {
  cancelLabel?: string
  initialData: TaskFormData
  isSaving?: boolean
  onCancel?: () => void
  onSaveTask: (taskData: TaskFormData) => void
  submitLabel: string
}

const createSubtaskId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const normalizeLabelText = (value: string) =>
  Array.from(
    new Set(
      value
        .split(',')
        .map((label) => label.trim())
        .filter(Boolean),
    ),
  ).slice(0, 8)

export function TaskForm({
  cancelLabel = 'Cancel',
  initialData,
  isSaving = false,
  onCancel,
  onSaveTask,
  submitLabel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialData.title)
  const [description, setDescription] = useState(initialData.description)
  const [department, setDepartment] = useState(initialData.department)
  const [status, setStatus] = useState(initialData.status)
  const [priority, setPriority] = useState(initialData.priority)
  const [dueDate, setDueDate] = useState(initialData.dueDate)
  const [assignee, setAssignee] = useState(initialData.assignee)
  const [labelsText, setLabelsText] = useState(initialData.labels.join(', '))
  const [subtasks, setSubtasks] = useState<Subtask[]>(initialData.subtasks)
  const [subtaskDraft, setSubtaskDraft] = useState('')
  const [titleError, setTitleError] = useState('')
  const [subtaskError, setSubtaskError] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const titleErrorId = 'task-title-error'
  const subtaskErrorId = 'task-subtask-error'

  const addSubtask = () => {
    const title = subtaskDraft.trim()

    if (!title) {
      setSubtaskError('Enter a subtask title before adding it.')
      return
    }

    setSubtasks((currentSubtasks) => [
      ...currentSubtasks,
      { id: createSubtaskId(), title, completed: false },
    ])
    setSubtaskDraft('')
    setSubtaskError('')
  }

  const removeSubtask = (subtaskId: string) => {
    setSubtasks((currentSubtasks) =>
      currentSubtasks.filter((subtask) => subtask.id !== subtaskId),
    )
  }

  const updateSubtask = (subtaskId: string, completed: boolean) => {
    setSubtasks((currentSubtasks) =>
      currentSubtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, completed } : subtask,
      ),
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (hasSubmitted || isSaving) {
      return
    }

    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      setTitleError('Please enter a task title.')
      return
    }

    setHasSubmitted(true)
    onSaveTask({
      title: trimmedTitle,
      description: description.trim(),
      department,
      status,
      priority,
      dueDate,
      assignee: assignee.trim(),
      labels: normalizeLabelText(labelsText),
      subtasks,
      aiAssisted: initialData.aiAssisted,
    })
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field form-field-wide">
          <label htmlFor="task-title">Task title</label>
          <input
            aria-describedby={titleError ? titleErrorId : undefined}
            aria-invalid={titleError ? 'true' : 'false'}
            autoComplete="off"
            id="task-title"
            name="task-title"
            onChange={(event) => {
              setTitle(event.target.value)
              if (titleError) {
                setTitleError('')
              }
            }}
            placeholder="Launch Instagram campaign"
            type="text"
            value={title}
          />
          {titleError ? (
            <p className="field-error" id={titleErrorId} role="alert">
              {titleError}
            </p>
          ) : null}
        </div>

        <div className="form-field form-field-wide">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            name="task-description"
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add context, constraints, or acceptance criteria."
            rows={4}
            value={description}
          />
        </div>

        <div className="form-field">
          <label htmlFor="task-department">Department</label>
          <select
            id="task-department"
            name="task-department"
            onChange={(event) =>
              setDepartment(event.target.value as typeof department)
            }
            value={department}
          >
            {departments.map((item) => (
              <option key={item} value={item}>
                {departmentLabels[item]}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="task-status">Workflow status</label>
          <select
            id="task-status"
            name="task-status"
            onChange={(event) => setStatus(event.target.value as typeof status)}
            value={status}
          >
            {workflowStatuses.map((item) => (
              <option key={item} value={item}>
                {workflowStatusLabels[item]}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            name="task-priority"
            onChange={(event) =>
              setPriority(event.target.value as typeof priority)
            }
            value={priority}
          >
            {priorities.map((item) => (
              <option key={item} value={item}>
                {priorityLabels[item]}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="task-due-date">Due date</label>
          <input
            id="task-due-date"
            name="task-due-date"
            onChange={(event) => setDueDate(event.target.value)}
            type="date"
            value={dueDate}
          />
        </div>

        <div className="form-field">
          <label htmlFor="task-assignee">Assignee</label>
          <input
            autoComplete="off"
            id="task-assignee"
            name="task-assignee"
            onChange={(event) => setAssignee(event.target.value)}
            placeholder="Owner name"
            type="text"
            value={assignee}
          />
        </div>

        <div className="form-field form-field-wide">
          <label htmlFor="task-labels">Labels</label>
          <input
            autoComplete="off"
            id="task-labels"
            name="task-labels"
            onChange={(event) => setLabelsText(event.target.value)}
            placeholder="Campaign, Instagram, Launch"
            type="text"
            value={labelsText}
          />
          <p className="field-hint">Separate labels with commas.</p>
        </div>
      </div>

      <fieldset className="subtask-editor">
        <legend>Subtasks</legend>
        <div className="subtask-entry">
          <div className="form-field">
            <label htmlFor="task-subtask">Add subtask</label>
            <input
              aria-describedby={subtaskError ? subtaskErrorId : undefined}
              aria-invalid={subtaskError ? 'true' : 'false'}
              autoComplete="off"
              id="task-subtask"
              name="task-subtask"
              onChange={(event) => {
                setSubtaskDraft(event.target.value)
                if (subtaskError) {
                  setSubtaskError('')
                }
              }}
              placeholder="Define target audience"
              type="text"
              value={subtaskDraft}
            />
            {subtaskError ? (
              <p className="field-error" id={subtaskErrorId} role="alert">
                {subtaskError}
              </p>
            ) : null}
          </div>
          <button
            className="secondary-action"
            onClick={addSubtask}
            type="button"
          >
            Add subtask
          </button>
        </div>

        {subtasks.length > 0 ? (
          <ul className="subtask-list">
            {subtasks.map((subtask) => (
              <li key={subtask.id}>
                <label>
                  <input
                    checked={subtask.completed}
                    onChange={(event) =>
                      updateSubtask(subtask.id, event.target.checked)
                    }
                    type="checkbox"
                  />
                  <span>{subtask.title}</span>
                </label>
                <button
                  aria-label={`Remove subtask ${subtask.title}`}
                  className="text-action danger"
                  onClick={() => removeSubtask(subtask.id)}
                  type="button"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted-copy">No subtasks added yet.</p>
        )}
      </fieldset>

      <div className="form-actions">
        {onCancel ? (
          <button className="secondary-action" onClick={onCancel} type="button">
            {cancelLabel}
          </button>
        ) : null}
        <button className="primary-action" disabled={isSaving} type="submit">
          {isSaving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
