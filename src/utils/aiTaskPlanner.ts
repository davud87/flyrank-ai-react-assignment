import {
  isDepartment,
  isPriority,
  isWorkflowStatus,
} from '../types/task'
import type { TaskPlannerSuggestion } from '../types/task'

export const AI_TASK_PLANNER_SYSTEM_PROMPT = `You are a project-management assistant for TaskFlow AI. Convert vague work descriptions into concise structured project tasks. Use only these departments: marketing, technical, finance, design, sales, operations, hr. Use only these priorities: low, medium, high, critical. Use only these statuses: backlog, todo, in-progress, review, done. Do not invent dates when the user has not provided enough information. Keep subtasks actionable and specific. Return only valid JSON with this shape: {"title":"string","description":"string","department":"marketing","priority":"medium","status":"todo","labels":["string"],"subtasks":["string"],"dueDate":"YYYY-MM-DD or empty string","assignee":"string or empty string"}.`

type PlannerValidationResult =
  | { ok: true; suggestion: TaskPlannerSuggestion }
  | { error: string; ok: false }

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const normalizeString = (value: unknown) =>
  typeof value === 'string' ? value.trim() : ''

const normalizeStringArray = (
  value: unknown,
  fieldName: string,
  maxItems: number,
): { error: string; value: string[] } | { error: null; value: string[] } => {
  if (!Array.isArray(value)) {
    return { error: `${fieldName} must be an array.`, value: [] }
  }

  const normalized = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, maxItems)

  if (normalized.length === 0 && fieldName === 'subtasks') {
    return { error: 'subtasks must include at least one item.', value: [] }
  }

  return { error: null, value: Array.from(new Set(normalized)) }
}

export const extractJsonObject = (content: string) => {
  const trimmed = content.trim()

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed
  }

  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')

  if (start === -1 || end === -1 || end <= start) {
    return ''
  }

  return trimmed.slice(start, end + 1)
}

export const validateTaskPlannerSuggestion = (
  value: unknown,
): PlannerValidationResult => {
  if (!isRecord(value)) {
    return { ok: false, error: 'AI response must be a JSON object.' }
  }

  const title = normalizeString(value.title)
  const description = normalizeString(value.description)
  const labels = normalizeStringArray(value.labels, 'labels', 8)
  const subtasks = normalizeStringArray(value.subtasks, 'subtasks', 10)
  const dueDate = normalizeString(value.dueDate)
  const assignee = normalizeString(value.assignee)

  if (!title || title.length > 120) {
    return { ok: false, error: 'AI response title is missing or too long.' }
  }

  if (!description || description.length > 800) {
    return {
      ok: false,
      error: 'AI response description is missing or too long.',
    }
  }

  if (!isDepartment(value.department)) {
    return { ok: false, error: 'AI response uses an unsupported department.' }
  }

  if (!isPriority(value.priority)) {
    return { ok: false, error: 'AI response uses an unsupported priority.' }
  }

  if (!isWorkflowStatus(value.status)) {
    return { ok: false, error: 'AI response uses an unsupported status.' }
  }

  if (labels.error) {
    return { ok: false, error: labels.error }
  }

  if (subtasks.error) {
    return { ok: false, error: subtasks.error }
  }

  if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    return { ok: false, error: 'AI response due date must use YYYY-MM-DD.' }
  }

  return {
    ok: true,
    suggestion: {
      title,
      description,
      department: value.department,
      priority: value.priority,
      status: value.status,
      labels: labels.value,
      subtasks: subtasks.value,
      dueDate,
      assignee,
    },
  }
}

export const parseTaskPlannerResponse = (
  content: string,
): PlannerValidationResult => {
  try {
    const json = extractJsonObject(content)

    if (!json) {
      return { ok: false, error: 'AI response did not include JSON.' }
    }

    return validateTaskPlannerSuggestion(JSON.parse(json))
  } catch {
    return { ok: false, error: 'AI response contained malformed JSON.' }
  }
}
