import type { FilterStatus } from '../types/task'

const filters: Array<{ label: string; value: FilterStatus }> = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
]

export function TaskControls() {
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
          placeholder="Search by title or description"
          disabled
        />
      </div>

      <div className="filter-group" aria-label="Filter tasks">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={
              filter.value === 'all' ? 'filter-button active' : 'filter-button'
            }
            aria-pressed={filter.value === 'all'}
            disabled
          >
            {filter.label}
          </button>
        ))}
      </div>
    </section>
  )
}
