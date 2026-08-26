import { isPriority } from '../types/task'
import type { Task } from '../types/task'

const TASK_STORAGE_KEY = 'taskflow.tasks'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const isTask = (value: unknown): value is Task => {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    (value.description === undefined || typeof value.description === 'string') &&
    isPriority(value.priority) &&
    typeof value.completed === 'boolean' &&
    typeof value.createdAt === 'string' &&
    (value.updatedAt === undefined || typeof value.updatedAt === 'string')
  )
}

export const loadTasks = (): Task[] => {
  try {
    const storedTasks = localStorage.getItem(TASK_STORAGE_KEY)

    if (!storedTasks) {
      return []
    }

    const parsedTasks: unknown = JSON.parse(storedTasks)

    if (!Array.isArray(parsedTasks) || !parsedTasks.every(isTask)) {
      return []
    }

    return parsedTasks
  } catch {
    return []
  }
}

export const saveTasks = (tasks: Task[]) => {
  try {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // If storage is unavailable or full, keep the in-memory app usable.
  }
}
