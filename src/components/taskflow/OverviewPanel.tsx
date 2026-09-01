import { departmentLabels } from '../../types/task'
import type {
  getDepartmentProgress,
  getTaskStats,
} from '../../utils/taskAnalytics'

type DepartmentProgress = ReturnType<typeof getDepartmentProgress>
type TaskStats = ReturnType<typeof getTaskStats>

type OverviewPanelProps = {
  departmentProgress: DepartmentProgress
  onOpenTasks: () => void
  stats: TaskStats
}

export function OverviewPanel({
  departmentProgress,
  onOpenTasks,
  stats,
}: OverviewPanelProps) {
  const statCards = [
    ['Total tasks', stats.total],
    ['Backlog', stats.byStatus.backlog],
    ['To Do', stats.byStatus.todo],
    ['In Progress', stats.byStatus['in-progress']],
    ['Review', stats.byStatus.review],
    ['Completed', stats.completed],
    ['Overdue', stats.overdue],
    ['High/Critical', stats.highImpact],
  ] as const

  return (
    <section className="overview-grid" aria-label="Project statistics">
      <div className="stat-grid">
        {statCards.map(([label, value]) => (
          <article className="stat-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>

      <section className="progress-panel" aria-labelledby="progress-title">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">Departments</p>
            <h2 id="progress-title">Progress by space</h2>
          </div>
          <button className="secondary-action" onClick={onOpenTasks} type="button">
            View tasks
          </button>
        </div>
        <ul className="progress-list">
          {departmentProgress.map((item) => (
            <li key={item.department}>
              <div>
                <span>{departmentLabels[item.department]}</span>
                <strong>{item.progress}%</strong>
              </div>
              <progress
                aria-label={`${departmentLabels[item.department]} progress`}
                max={100}
                value={item.progress}
              />
              <small>
                {item.done} of {item.total} tasks complete
              </small>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}
