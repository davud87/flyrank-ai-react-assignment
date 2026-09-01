import { departments, workflowStatuses } from '../types/task'
import type {
  Department,
  DueFilter,
  Priority,
  Task,
  TaskFilters,
  WorkflowStatus,
} from '../types/task'

const todayDate = () => new Date().toISOString().slice(0, 10)

export const defaultFilters: TaskFilters = {
  search: '',
  department: 'all',
  status: 'all',
  priority: 'all',
  due: 'all',
  assignee: '',
}

export const isTaskOverdue = (task: Task, today = todayDate()) => {
  return Boolean(task.dueDate && task.dueDate < today && task.status !== 'done')
}

export const matchesDueFilter = (
  task: Task,
  dueFilter: DueFilter,
  today = todayDate(),
) => {
  if (dueFilter === 'all') {
    return true
  }

  if (dueFilter === 'none') {
    return !task.dueDate
  }

  if (!task.dueDate) {
    return false
  }

  if (dueFilter === 'overdue') {
    return isTaskOverdue(task, today)
  }

  if (dueFilter === 'today') {
    return task.dueDate === today
  }

  return task.dueDate > today
}

export const filterTasks = (
  tasks: Task[],
  filters: TaskFilters,
  selectedDepartment: Department | 'all',
) => {
  const normalizedSearch = filters.search.trim().toLowerCase()
  const normalizedAssignee = filters.assignee.trim().toLowerCase()
  const activeDepartment =
    filters.department !== 'all' ? filters.department : selectedDepartment

  return tasks.filter((task) => {
    const searchableText = [
      task.title,
      task.description,
      task.assignee,
      task.department,
      ...task.labels,
    ]
      .join(' ')
      .toLowerCase()

    return (
      (activeDepartment === 'all' || task.department === activeDepartment) &&
      (filters.status === 'all' || task.status === filters.status) &&
      (filters.priority === 'all' || task.priority === filters.priority) &&
      matchesDueFilter(task, filters.due) &&
      (!normalizedAssignee ||
        task.assignee.toLowerCase().includes(normalizedAssignee)) &&
      (!normalizedSearch || searchableText.includes(normalizedSearch))
    )
  })
}

export const countTasksByStatus = (tasks: Task[]) => {
  return workflowStatuses.reduce(
    (counts, status) => ({
      ...counts,
      [status]: tasks.filter((task) => task.status === status).length,
    }),
    {} as Record<WorkflowStatus, number>,
  )
}

export const countTasksByPriority = (tasks: Task[]) => {
  return tasks.reduce(
    (counts, task) => ({
      ...counts,
      [task.priority]: counts[task.priority] + 1,
    }),
    {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    } satisfies Record<Priority, number>,
  )
}

export const getTaskStats = (tasks: Task[]) => {
  const byStatus = countTasksByStatus(tasks)
  const byPriority = countTasksByPriority(tasks)

  return {
    total: tasks.length,
    byStatus,
    completed: byStatus.done,
    overdue: tasks.filter((task) => isTaskOverdue(task)).length,
    highImpact: byPriority.high + byPriority.critical,
  }
}

export const getDepartmentProgress = (tasks: Task[]) => {
  return departments.map((department) => {
    const departmentTasks = tasks.filter((task) => task.department === department)
    const doneTasks = departmentTasks.filter((task) => task.status === 'done')
    const progress =
      departmentTasks.length === 0
        ? 0
        : Math.round((doneTasks.length / departmentTasks.length) * 100)

    return {
      department,
      done: doneTasks.length,
      progress,
      total: departmentTasks.length,
    }
  })
}
