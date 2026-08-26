export type Priority = 'low' | 'medium' | 'high'

export type FilterStatus = 'all' | 'active' | 'completed'

export interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  completed: boolean
  createdAt: string
  updatedAt?: string
}
