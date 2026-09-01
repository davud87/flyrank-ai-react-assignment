import { Search } from 'lucide-react'
import {
  priorities,
  priorityLabels,
  workflowStatusLabels,
  workflowStatuses,
} from '../../types/task'
import type { TaskFilters } from '../../types/task'

type TaskFilterBarProps = {
  filters: TaskFilters
  onReset: () => void
  onUpdate: (updates: Partial<TaskFilters>) => void
}

export function TaskFilterBar({ filters, onReset, onUpdate }: TaskFilterBarProps) {
  return (
    <form className="filter-bar" onSubmit={(event) => event.preventDefault()}>
      <div className="search-control">
        <Search aria-hidden="true" size={18} />
        <label className="sr-only" htmlFor="task-search">
          Search tasks
        </label>
        <input
          id="task-search"
          onChange={(event) => onUpdate({ search: event.target.value })}
          placeholder="Search title, description, labels..."
          type="search"
          value={filters.search}
        />
      </div>

      <label>
        <span>Status</span>
        <select
          onChange={(event) =>
            onUpdate({ status: event.target.value as TaskFilters['status'] })
          }
          value={filters.status}
        >
          <option value="all">All statuses</option>
          {workflowStatuses.map((status) => (
            <option key={status} value={status}>
              {workflowStatusLabels[status]}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Priority</span>
        <select
          onChange={(event) =>
            onUpdate({ priority: event.target.value as TaskFilters['priority'] })
          }
          value={filters.priority}
        >
          <option value="all">All priorities</option>
          {priorities.map((priority) => (
            <option key={priority} value={priority}>
              {priorityLabels[priority]}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Due</span>
        <select
          onChange={(event) =>
            onUpdate({ due: event.target.value as TaskFilters['due'] })
          }
          value={filters.due}
        >
          <option value="all">Any date</option>
          <option value="overdue">Overdue</option>
          <option value="today">Today</option>
          <option value="upcoming">Upcoming</option>
          <option value="none">No date</option>
        </select>
      </label>

      <label>
        <span>Assignee</span>
        <input
          onChange={(event) => onUpdate({ assignee: event.target.value })}
          placeholder="Owner"
          type="text"
          value={filters.assignee}
        />
      </label>

      <button className="secondary-action" onClick={onReset} type="button">
        Reset
      </button>
    </form>
  )
}
