import { describe, expect, it } from 'vitest'
import { normalizeTask } from './taskStorage'

describe('taskStorage', () => {
  it('normalizes legacy completed TaskFlow tasks without dropping user data', () => {
    const task = normalizeTask({
      id: 'legacy-1',
      title: '  Ship old assignment  ',
      description: '  keep this description  ',
      priority: 'high',
      completed: true,
      createdAt: '2026-08-20T10:00:00.000Z',
    })

    expect(task).toMatchObject({
      id: 'legacy-1',
      title: 'Ship old assignment',
      description: 'keep this description',
      department: 'operations',
      status: 'done',
      priority: 'high',
      labels: [],
      subtasks: [],
      completed: true,
    })
  })

  it('rejects invalid task records with empty titles', () => {
    expect(normalizeTask({ id: 'broken', title: '   ' })).toBeNull()
  })
})
