export type Priority = 'low' | 'medium' | 'high'

export type FilterStatus = 'all' | 'active' | 'completed'

export type TaskFormData = {
  title: string
  description: string
  priority: Priority
}

export interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  completed: boolean
  createdAt: string
  updatedAt?: string
}

export const priorities: Priority[] = ['low', 'medium', 'high']

export const priorityLabels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export const isPriority = (value: unknown): value is Priority => {
  return typeof value === 'string' && priorities.includes(value as Priority)
}
