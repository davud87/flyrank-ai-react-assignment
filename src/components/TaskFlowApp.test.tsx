import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TaskFlowApp } from './TaskFlowApp'

describe('TaskFlowApp', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('creates a valid task and rejects an empty title', async () => {
    const user = userEvent.setup()
    render(<TaskFlowApp />)

    await user.click(screen.getByRole('button', { name: 'New task' }))
    await user.click(screen.getByRole('button', { name: 'Create task' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a task title.')

    await user.type(screen.getByLabelText('Task title'), '  Draft launch plan  ')
    await user.selectOptions(screen.getByLabelText('Department'), 'sales')
    await user.selectOptions(screen.getByLabelText('Workflow status'), 'backlog')
    await user.click(screen.getByRole('button', { name: 'Create task' }))

    const taskButton = await screen.findByRole('button', {
      name: 'Draft launch plan',
    })
    expect(taskButton).toBeInTheDocument()
    expect(screen.getAllByText('Sales').length).toBeGreaterThan(0)
  })

  it('edits, deletes, and moves a task with accessible controls', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<TaskFlowApp />)

    await user.click(screen.getByRole('button', { name: 'Prepare September campaign' }))
    const dialog = screen.getByRole('dialog', { name: 'Task details' })
    await user.selectOptions(
      within(dialog).getByLabelText('Move Prepare September campaign to status'),
      'done',
    )

    await waitFor(() => {
      expect(screen.getByText('Prepare September campaign moved to Done.')).toBeInTheDocument()
    })

    await user.click(within(dialog).getByRole('button', { name: 'Edit task' }))
    await user.clear(screen.getByLabelText('Task title'))
    await user.type(screen.getByLabelText('Task title'), 'September campaign launch')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(await screen.findByRole('button', { name: 'September campaign launch' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'September campaign launch' }))
    await user.click(screen.getByRole('button', { name: 'Delete task' }))

    expect(screen.queryByRole('button', { name: 'September campaign launch' })).not.toBeInTheDocument()
  })

  it('filters by department and search text', async () => {
    const user = userEvent.setup()
    render(<TaskFlowApp />)

    await user.click(screen.getByRole('button', { name: /Technical/ }))
    expect(screen.getByRole('button', { name: 'Improve page performance' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Prepare September campaign' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /All departments/ }))
    await user.type(screen.getByLabelText('Search tasks'), 'budget')

    expect(screen.getByRole('button', { name: 'Approve Q4 marketing budget' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Improve page performance' })).not.toBeInTheDocument()
  })

  it('lets users accept and edit an AI suggestion before creating a task', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          suggestion: {
            title: 'Launch Instagram campaign',
            description: 'Plan and configure a launch campaign.',
            department: 'marketing',
            priority: 'high',
            status: 'todo',
            labels: ['Instagram', 'Launch'],
            subtasks: ['Define audience', 'Prepare visuals'],
            dueDate: '2026-09-20',
            assignee: 'Amina',
          },
        }),
      ),
    )

    render(<TaskFlowApp />)

    await user.type(
      screen.getByLabelText('Project requirement'),
      'Launch a campaign before September 20.',
    )
    await user.click(screen.getByRole('button', { name: /Generate suggestion/ }))

    expect(await screen.findByText('Plan and configure a launch campaign.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Review and edit' }))

    const dialog = screen.getByRole('dialog', { name: 'Review AI suggestion' })
    const title = within(dialog).getByLabelText('Task title')
    await user.clear(title)
    await user.type(title, 'Edited Instagram campaign')
    await user.click(within(dialog).getByRole('button', { name: 'Create from suggestion' }))

    expect(await screen.findByRole('button', { name: 'Edited Instagram campaign' })).toBeInTheDocument()
    expect(screen.getByText('AI assisted')).toBeInTheDocument()
  })

  it('prevents duplicate AI planning requests while loading', async () => {
    const user = userEvent.setup()
    let resolveResponse: (response: Response) => void = () => undefined
    const pendingResponse = new Promise<Response>((resolve) => {
      resolveResponse = resolve
    })
    const fetchMock = vi.fn(() => pendingResponse)
    vi.stubGlobal('fetch', fetchMock)

    render(<TaskFlowApp />)

    await user.type(screen.getByLabelText('Project requirement'), 'Plan technical work.')
    await user.click(screen.getByRole('button', { name: /Generate suggestion/ }))
    await user.click(screen.getByRole('button', { name: /Planning/ }))

    expect(fetchMock).toHaveBeenCalledTimes(1)

    resolveResponse(
      Response.json({
        suggestion: {
          title: 'Review performance',
          description: 'Review technical performance work.',
          department: 'technical',
          priority: 'medium',
          status: 'todo',
          labels: [],
          subtasks: ['Capture metrics'],
          dueDate: '',
          assignee: '',
        },
      }),
    )

    expect(await screen.findByText('Review technical performance work.')).toBeInTheDocument()
  })
})
