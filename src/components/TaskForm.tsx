import type { Priority } from '../types/task'

const priorities: Priority[] = ['low', 'medium', 'high']

const priorityLabels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export function TaskForm() {
  return (
    <form className="task-form" aria-labelledby="task-form-title">
      <div className="section-heading">
        <p className="section-kicker">Create</p>
        <h2 id="task-form-title">Add a new task</h2>
      </div>

      <div className="form-field">
        <label htmlFor="task-title">Task title</label>
        <input
          id="task-title"
          name="task-title"
          type="text"
          placeholder="Prepare internship update"
          autoComplete="off"
        />
      </div>

      <div className="form-field">
        <label htmlFor="task-description">Description optional</label>
        <textarea
          id="task-description"
          name="task-description"
          rows={4}
          placeholder="Add details, context, or next steps"
        />
      </div>

      <div className="form-field">
        <label htmlFor="task-priority">Priority</label>
        <select id="task-priority" name="task-priority" defaultValue="medium">
          {priorities.map((priority) => (
            <option key={priority} value={priority}>
              {priorityLabels[priority]}
            </option>
          ))}
        </select>
      </div>

      <button className="primary-action" type="button">
        Add Task
      </button>
    </form>
  )
}
