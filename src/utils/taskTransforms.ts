import type { Department, Subtask, Task, TaskFormData, TaskPlannerSuggestion } from '../types/task'

export const createTaskId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const createEmptyTaskData = (
  department: Department = 'marketing',
): TaskFormData => ({
  title: '',
  description: '',
  department,
  status: 'todo',
  priority: 'medium',
  labels: [],
  subtasks: [],
  dueDate: '',
  assignee: '',
  aiAssisted: false,
})

export const taskToFormData = (task: Task): TaskFormData => ({
  title: task.title,
  description: task.description,
  department: task.department,
  status: task.status,
  priority: task.priority,
  dueDate: task.dueDate,
  labels: task.labels,
  subtasks: task.subtasks,
  assignee: task.assignee,
  aiAssisted: task.aiAssisted,
})

export const suggestionToFormData = (
  suggestion: TaskPlannerSuggestion,
): TaskFormData => ({
  title: suggestion.title,
  description: suggestion.description,
  department: suggestion.department,
  status: suggestion.status,
  priority: suggestion.priority,
  labels: suggestion.labels,
  subtasks: suggestion.subtasks.map((title) => ({
    id: createTaskId(),
    title,
    completed: false,
  })),
  dueDate: suggestion.dueDate ?? '',
  assignee: suggestion.assignee ?? '',
  aiAssisted: true,
})

export const getSubtaskProgress = (subtasks: Subtask[]) => {
  const completed = subtasks.filter((subtask) => subtask.completed).length

  return {
    completed,
    total: subtasks.length,
  }
}
