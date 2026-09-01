import { describe, expect, it } from 'vitest'
import {
  extractJsonObject,
  parseTaskPlannerResponse,
  validateTaskPlannerSuggestion,
} from './aiTaskPlanner'

describe('aiTaskPlanner validation', () => {
  it('accepts a valid structured AI suggestion', () => {
    const result = validateTaskPlannerSuggestion({
      title: 'Launch Instagram campaign',
      description: 'Plan the campaign before launch.',
      department: 'marketing',
      priority: 'high',
      status: 'todo',
      labels: ['Instagram', 'Campaign'],
      subtasks: ['Define audience', 'Prepare visuals'],
      dueDate: '2026-09-20',
      assignee: '',
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.suggestion.department).toBe('marketing')
      expect(result.suggestion.subtasks).toHaveLength(2)
    }
  })

  it('rejects invalid structured output', () => {
    const result = validateTaskPlannerSuggestion({
      title: 'Bad task',
      description: 'Invalid department should fail.',
      department: 'legal',
      priority: 'high',
      status: 'todo',
      labels: [],
      subtasks: ['Review'],
    })

    expect(result).toMatchObject({
      ok: false,
      error: 'AI response uses an unsupported department.',
    })
  })

  it('parses JSON even when the provider wraps it in extra text', () => {
    const json = `Here is the task:
      {"title":"Review checkout","description":"Fix validation.","department":"technical","priority":"critical","status":"review","labels":["Checkout"],"subtasks":["Reproduce bug"],"dueDate":"","assignee":"Davud"}`

    expect(extractJsonObject(json)).toContain('"title":"Review checkout"')
    expect(parseTaskPlannerResponse(json).ok).toBe(true)
  })

  it('rejects malformed JSON', () => {
    expect(parseTaskPlannerResponse('{ bad json').ok).toBe(false)
  })
})
