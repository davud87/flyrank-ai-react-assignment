import type { FilterStatus } from '../types/task'

const filters: Array<{ label: string; value: FilterStatus }> = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
]

type TaskControlsProps = {
  activeFilter: FilterStatus
  searchQuery: string
  onFilterChange: (filter: FilterStatus) => void
  onSearchChange: (query: string) => void
}

export function TaskControls({
  activeFilter,
  searchQuery,
  onFilterChange,
  onSearchChange,
}: TaskControlsProps) {
  return (
    <section className="task-controls" aria-labelledby="tasks-title">
      <div className="section-heading">
        <p className="section-kicker">Review</p>
        <h2 id="tasks-title">Tasks</h2>
      </div>

      <div className="search-field">
        <label htmlFor="task-search">Search tasks</label>
        <input
          id="task-search"
          name="task-search"
          type="search"
          value={searchQuery}
          placeholder="Search by title or description"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="filter-group" aria-label="Filter tasks">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={
              filter.value === activeFilter
                ? 'filter-button active'
                : 'filter-button'
            }
            aria-pressed={filter.value === activeFilter}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </section>
  )
}
