import { useState } from 'react'
import type { FormEvent } from 'react'
import { isPriority, priorities, priorityLabels } from '../types/task'
import type { Priority, Task, TaskFormData } from '../types/task'

type TaskFormProps = {
  editingTask: Task | null
  onCancelEditing: () => void
  onSaveTask: (taskData: TaskFormData) => void
}

export function TaskForm({
  editingTask,
  onCancelEditing,
  onSaveTask,
}: TaskFormProps) {
  const [title, setTitle] = useState(editingTask?.title ?? '')
  const [description, setDescription] = useState(editingTask?.description ?? '')
  const [priority, setPriority] = useState<Priority>(
    editingTask?.priority ?? 'medium',
  )
  const [titleError, setTitleError] = useState('')

  const isEditing = editingTask !== null
  const titleErrorId = 'task-title-error'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()

    if (!trimmedTitle) {
      setTitleError('Please enter a task title.')
      return
    }

    onSaveTask({
      title: trimmedTitle,
      description: trimmedDescription,
      priority,
    })

    if (!isEditing) {
      setTitle('')
      setDescription('')
      setPriority('medium')
    }

    setTitleError('')
  }

  const handleCancelEditing = () => {
    onCancelEditing()
    setTitleError('')
  }

  return (
    <form
      className="task-form"
      aria-labelledby="task-form-title"
      onSubmit={handleSubmit}
    >
      <div className="section-heading">
        <p className="section-kicker">{isEditing ? 'Edit' : 'Create'}</p>
        <h2 id="task-form-title">
          {isEditing ? 'Update task' : 'Add a new task'}
        </h2>
      </div>

      <div className="form-field">
        <label htmlFor="task-title">Task title</label>
        <input
          id="task-title"
          name="task-title"
          type="text"
          value={title}
          placeholder="Prepare internship update"
          autoComplete="off"
          aria-describedby={titleError ? titleErrorId : undefined}
          aria-invalid={titleError ? 'true' : 'false'}
          onChange={(event) => {
            setTitle(event.target.value)
            if (titleError) {
              setTitleError('')
            }
          }}
        />
        {titleError ? (
          <p className="field-error" id={titleErrorId} role="alert">
            {titleError}
          </p>
        ) : null}
      </div>

      <div className="form-field">
        <label htmlFor="task-description">Description optional</label>
        <textarea
          id="task-description"
          name="task-description"
          rows={4}
          value={description}
          placeholder="Add details, context, or next steps"
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          name="task-priority"
          value={priority}
          onChange={(event) => {
            if (isPriority(event.target.value)) {
              setPriority(event.target.value)
            }
          }}
        >
          {priorities.map((priority) => (
            <option key={priority} value={priority}>
              {priorityLabels[priority]}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button className="primary-action" type="submit">
          {isEditing ? 'Save Changes' : 'Add Task'}
        </button>

        {isEditing ? (
          <button
            className="secondary-action"
            type="button"
            onClick={handleCancelEditing}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  )
}
