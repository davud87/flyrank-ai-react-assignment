import { afterEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

const createRequest = (body: unknown) =>
  new Request('http://localhost/api/ai/task-planner', {
    method: 'POST',
    body: JSON.stringify(body),
  })

describe('/api/ai/task-planner', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    delete process.env.OPENROUTER_API_KEY
  })

  it('fails safely when the API key is missing', async () => {
    const response = await POST(createRequest({ prompt: 'Plan a campaign' }))
    const payload = await response.json()

    expect(response.status).toBe(503)
    expect(payload.error).toContain('OPENROUTER_API_KEY')
  })

  it('returns validated AI suggestions from the provider', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key'
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  title: 'Launch Instagram campaign',
                  description: 'Plan and configure a launch campaign.',
                  department: 'marketing',
                  priority: 'high',
                  status: 'todo',
                  labels: ['Instagram', 'Launch'],
                  subtasks: ['Define audience', 'Prepare visuals'],
                  dueDate: '2026-09-20',
                  assignee: '',
                }),
              },
            },
          ],
        }),
      ),
    )

    const response = await POST(createRequest({ prompt: 'Plan a campaign' }))
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload.suggestion.title).toBe('Launch Instagram campaign')
  })

  it('rejects malformed provider output', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key'
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          choices: [{ message: { content: '{ nope' } }],
        }),
      ),
    )

    const response = await POST(createRequest({ prompt: 'Plan a campaign' }))
    const payload = await response.json()

    expect(response.status).toBe(502)
    expect(payload.error).toContain('could not safely use')
  })
})
