import {
  departments,
  isDepartment,
  isPriority,
  isWorkflowStatus,
  priorities,
  workflowStatuses,
} from '../types/task'
import type { Department, Priority, Subtask, Task, WorkflowStatus } from '../types/task'

const TASK_STORAGE_KEY = 'taskflow.tasks'

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const normalizeText = (value: unknown) =>
  typeof value === 'string' ? value.trim() : ''

const normalizeLabels = (value: unknown) => {
  if (!Array.isArray(value)) {
    return []
  }

  return Array.from(
    new Set(
      value
        .filter((label): label is string => typeof label === 'string')
        .map((label) => label.trim())
        .filter(Boolean)
        .slice(0, 8),
    ),
  )
}

const normalizeSubtasks = (value: unknown): Subtask[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((subtask) => {
      if (typeof subtask === 'string') {
        const title = subtask.trim()
        return title
          ? {
              id: createId(),
              title,
              completed: false,
            }
          : null
      }

      if (!isRecord(subtask)) {
        return null
      }

      const title = normalizeText(subtask.title)

      if (!title) {
        return null
      }

      return {
        id: normalizeText(subtask.id) || createId(),
        title,
        completed: subtask.completed === true,
      }
    })
    .filter((subtask): subtask is Subtask => subtask !== null)
    .slice(0, 12)
}

const normalizeDepartment = (value: unknown): Department => {
  if (isDepartment(value)) {
    return value
  }

  const normalized = normalizeText(value).toLowerCase()
  const department = departments.find((item) => item === normalized)

  return department ?? 'operations'
}

const normalizePriority = (value: unknown): Priority => {
  if (isPriority(value)) {
    return value
  }

  const normalized = normalizeText(value).toLowerCase()
  const priority = priorities.find((item) => item === normalized)

  return priority ?? 'medium'
}

const normalizeStatus = (value: unknown, completed: unknown): WorkflowStatus => {
  if (isWorkflowStatus(value)) {
    return value
  }

  const normalized = normalizeText(value).toLowerCase()
  const matchedStatus = workflowStatuses.find((status) => status === normalized)

  if (matchedStatus) {
    return matchedStatus
  }

  return completed === true ? 'done' : 'todo'
}

const normalizeDate = (value: unknown) => {
  const text = normalizeText(value)

  if (!text) {
    return ''
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : ''
}

export const normalizeTask = (value: unknown): Task | null => {
  if (!isRecord(value)) {
    return null
  }

  const title = normalizeText(value.title)

  if (!title) {
    return null
  }

  const status = normalizeStatus(value.status, value.completed)
  const now = new Date().toISOString()

  return {
    id: normalizeText(value.id) || createId(),
    title,
    description: normalizeText(value.description),
    department: normalizeDepartment(value.department),
    status,
    priority: normalizePriority(value.priority),
    labels: normalizeLabels(value.labels),
    subtasks: normalizeSubtasks(value.subtasks),
    dueDate: normalizeDate(value.dueDate),
    assignee: normalizeText(value.assignee),
    aiAssisted: value.aiAssisted === true || value.aiGenerated === true,
    aiGenerated: value.aiGenerated === true,
    completed: status === 'done',
    createdAt: normalizeText(value.createdAt) || now,
    updatedAt: normalizeText(value.updatedAt) || undefined,
  }
}

export const sampleTasks: Task[] = [
  {
    id: 'sample-marketing-campaign',
    title: 'Prepare September campaign',
    description:
      'Coordinate the launch plan, creative assets, and tracking for the new service campaign.',
    department: 'marketing',
    status: 'in-progress',
    priority: 'high',
    labels: ['Campaign', 'Instagram'],
    subtasks: [
      {
        id: 'sample-marketing-audience',
        title: 'Define target audience',
        completed: true,
      },
      { id: 'sample-marketing-copy', title: 'Write ad copy', completed: false },
      {
        id: 'sample-marketing-tracking',
        title: 'Review tracking setup',
        completed: false,
      },
    ],
    dueDate: '2026-09-20',
    assignee: 'Amina',
    aiAssisted: false,
    completed: false,
    createdAt: '2026-08-27T10:00:00.000Z',
  },
  {
    id: 'sample-technical-performance',
    title: 'Improve page performance',
    description:
      'Review bundle size, image loading, and layout stability for the landing page.',
    department: 'technical',
    status: 'review',
    priority: 'medium',
    labels: ['Performance', 'Web'],
    subtasks: [
      {
        id: 'sample-technical-metrics',
        title: 'Capture current metrics',
        completed: true,
      },
      {
        id: 'sample-technical-fixes',
        title: 'Apply prioritized fixes',
        completed: true,
      },
      {
        id: 'sample-technical-review',
        title: 'Review production build output',
        completed: false,
      },
    ],
    dueDate: '',
    assignee: 'Davud',
    aiAssisted: false,
    completed: false,
    createdAt: '2026-08-26T09:00:00.000Z',
  },
  {
    id: 'sample-finance-budget',
    title: 'Approve Q4 marketing budget',
    description:
      'Confirm campaign allocation and document approval notes before launch planning.',
    department: 'finance',
    status: 'todo',
    priority: 'critical',
    labels: ['Budget', 'Q4'],
    subtasks: [
      {
        id: 'sample-finance-estimate',
        title: 'Review media spend estimate',
        completed: false,
      },
      {
        id: 'sample-finance-signoff',
        title: 'Collect stakeholder sign-off',
        completed: false,
      },
    ],
    dueDate: '2026-09-12',
    assignee: 'Lejla',
    aiAssisted: false,
    completed: false,
    createdAt: '2026-08-25T09:30:00.000Z',
  },
  {
    id: 'sample-design-graphics',
    title: 'Prepare campaign graphics',
    description: 'Create social formats for launch posts and paid placements.',
    department: 'design',
    status: 'backlog',
    priority: 'medium',
    labels: ['Creative', 'Social'],
    subtasks: [],
    dueDate: '',
    assignee: 'Mila',
    aiAssisted: false,
    completed: false,
    createdAt: '2026-08-24T14:00:00.000Z',
  },
]

export const loadTasks = (): Task[] => {
  if (typeof localStorage === 'undefined') {
    return sampleTasks
  }

  try {
    const storedTasks = localStorage.getItem(TASK_STORAGE_KEY)

    if (!storedTasks) {
      return sampleTasks
    }

    const parsedTasks: unknown = JSON.parse(storedTasks)

    if (!Array.isArray(parsedTasks)) {
      return sampleTasks
    }

    const normalizedTasks = parsedTasks
      .map(normalizeTask)
      .filter((task): task is Task => task !== null)

    return normalizedTasks.length > 0 ? normalizedTasks : sampleTasks
  } catch {
    return sampleTasks
  }
}

export const saveTasks = (tasks: Task[]) => {
  if (typeof localStorage === 'undefined') {
    return
  }

  try {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // If storage is unavailable or full, keep the in-memory app usable.
  }
}
