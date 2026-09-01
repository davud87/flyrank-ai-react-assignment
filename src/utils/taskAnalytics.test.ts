import { describe, expect, it } from 'vitest'
import type { Task } from '../types/task'
import { defaultFilters, filterTasks, getDepartmentProgress, getTaskStats } from './taskAnalytics'

const tasks: Task[] = [
  {
    id: '1',
    title: 'Prepare Instagram campaign',
    description: 'Launch plan for new service',
    department: 'marketing',
    status: 'in-progress',
    priority: 'high',
    labels: ['Campaign'],
    subtasks: [],
    dueDate: '2026-09-20',
    assignee: 'Amina',
    aiAssisted: false,
    completed: false,
    createdAt: '2026-08-20T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Fix checkout validation',
    description: 'Technical form bug',
    department: 'technical',
    status: 'done',
    priority: 'critical',
    labels: ['Checkout'],
    subtasks: [],
    dueDate: '2026-08-01',
    assignee: 'Davud',
    aiAssisted: false,
    completed: true,
    createdAt: '2026-08-20T10:00:00.000Z',
  },
]

describe('taskAnalytics', () => {
  it('filters by department and search text', () => {
    expect(
      filterTasks(tasks, { ...defaultFilters, search: 'instagram' }, 'marketing'),
    ).toHaveLength(1)
    expect(filterTasks(tasks, defaultFilters, 'technical')).toHaveLength(1)
  })

  it('calculates overview stats and department progress from task state', () => {
    const stats = getTaskStats(tasks)
    const progress = getDepartmentProgress(tasks)

    expect(stats.total).toBe(2)
    expect(stats.byStatus.done).toBe(1)
    expect(stats.highImpact).toBe(2)
    expect(progress.find((item) => item.department === 'technical')).toMatchObject({
      progress: 100,
      total: 1,
    })
  })
})
