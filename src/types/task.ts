export const departments = [
  'marketing',
  'technical',
  'finance',
  'design',
  'sales',
  'operations',
  'hr',
] as const

export const workflowStatuses = [
  'backlog',
  'todo',
  'in-progress',
  'review',
  'done',
] as const

export const priorities = ['low', 'medium', 'high', 'critical'] as const

export type Department = (typeof departments)[number]
export type WorkflowStatus = (typeof workflowStatuses)[number]
export type Priority = (typeof priorities)[number]
export type AppSection = 'overview' | 'tasks'
export type DueFilter = 'all' | 'overdue' | 'today' | 'upcoming' | 'none'

export type Subtask = {
  id: string
  title: string
  completed: boolean
}

export type TaskFormData = {
  aiAssisted?: boolean
  assignee: string
  department: Department
  description: string
  dueDate: string
  labels: string[]
  priority: Priority
  status: WorkflowStatus
  subtasks: Subtask[]
  title: string
}

export interface Task extends TaskFormData {
  aiGenerated?: boolean
  completed: boolean
  createdAt: string
  id: string
  updatedAt?: string
}

export type TaskFilters = {
  assignee: string
  department: Department | 'all'
  due: DueFilter
  priority: Priority | 'all'
  search: string
  status: WorkflowStatus | 'all'
}

export type TaskPlannerSuggestion = {
  assignee?: string
  department: Department
  description: string
  dueDate?: string
  labels: string[]
  priority: Priority
  status: WorkflowStatus
  subtasks: string[]
  title: string
}

export const departmentLabels: Record<Department, string> = {
  marketing: 'Marketing',
  technical: 'Technical',
  finance: 'Finance',
  design: 'Design',
  sales: 'Sales',
  operations: 'Operations',
  hr: 'HR',
}

export const workflowStatusLabels: Record<WorkflowStatus, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  'in-progress': 'In Progress',
  review: 'Review',
  done: 'Done',
}

export const priorityLabels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}

export const isDepartment = (value: unknown): value is Department => {
  return typeof value === 'string' && departments.includes(value as Department)
}

export const isWorkflowStatus = (value: unknown): value is WorkflowStatus => {
  return (
    typeof value === 'string' &&
    workflowStatuses.includes(value as WorkflowStatus)
  )
}

export const isPriority = (value: unknown): value is Priority => {
  return typeof value === 'string' && priorities.includes(value as Priority)
}
