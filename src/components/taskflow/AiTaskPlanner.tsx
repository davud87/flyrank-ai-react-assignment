import { useState } from 'react'
import { Bot, CheckCircle2, Sparkles } from 'lucide-react'
import {
  departmentLabels,
  priorityLabels,
  workflowStatusLabels,
} from '../../types/task'
import type { TaskPlannerSuggestion } from '../../types/task'

type AiTaskPlannerProps = {
  onAcceptSuggestion: (
    suggestion: TaskPlannerSuggestion,
    trigger?: HTMLButtonElement | null,
  ) => void
}

export function AiTaskPlanner({ onAcceptSuggestion }: AiTaskPlannerProps) {
  const [prompt, setPrompt] = useState('')
  const [suggestion, setSuggestion] = useState<TaskPlannerSuggestion | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const errorId = 'ai-planner-error'

  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim()

    if (!trimmedPrompt) {
      setError('Describe the work you want AI to structure.')
      return
    }

    if (trimmedPrompt.length > 2000) {
      setError('Keep the request under 2,000 characters.')
      return
    }

    if (isLoading) {
      return
    }

    setIsLoading(true)
    setError('')
    setSuggestion(null)

    try {
      const response = await fetch('/api/ai/task-planner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: trimmedPrompt }),
      })
      const payload: unknown = await response.json()

      if (!response.ok) {
        const message =
          typeof payload === 'object' &&
          payload !== null &&
          'error' in payload &&
          typeof payload.error === 'string'
            ? payload.error
            : 'AI planning failed. You can still create the task manually.'
        throw new Error(message)
      }

      if (
        typeof payload === 'object' &&
        payload !== null &&
        'suggestion' in payload
      ) {
        setSuggestion(payload.suggestion as TaskPlannerSuggestion)
        return
      }

      throw new Error('AI returned an unexpected response.')
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'AI planning failed. You can still create the task manually.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="ai-panel" aria-labelledby="ai-planner-title">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">
            <Bot aria-hidden="true" size={14} />
            AI planner
          </p>
          <h2 id="ai-planner-title">Turn rough requirements into a task</h2>
        </div>
        <span>Review before creating</span>
      </div>

      <div className="ai-form">
        <label htmlFor="ai-task-input">Project requirement</label>
        <textarea
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? 'true' : 'false'}
          id="ai-task-input"
          maxLength={2000}
          onChange={(event) => {
            setPrompt(event.target.value)
            if (error) {
              setError('')
            }
          }}
          placeholder="We need to launch an Instagram campaign for our new service before September 20 with around 1000 KM available for advertising."
          rows={3}
          value={prompt}
        />
        {error ? (
          <p className="field-error" id={errorId} role="alert">
            {error}
          </p>
        ) : null}
        <div className="ai-actions">
          <button
            className="secondary-action"
            disabled={isLoading}
            onClick={handleGenerate}
            type="button"
          >
            <Sparkles aria-hidden="true" size={16} />
            {isLoading ? 'Planning...' : 'Generate suggestion'}
          </button>
          {error ? (
            <button
              className="text-action"
              disabled={isLoading}
              onClick={handleGenerate}
              type="button"
            >
              Retry
            </button>
          ) : null}
        </div>
      </div>

      {isLoading ? (
        <div className="ai-loading" role="status">
          <span />
          Structuring task details...
        </div>
      ) : null}

      {suggestion ? (
        <article className="ai-suggestion">
          <div>
            <span className="suggestion-icon">
              <CheckCircle2 aria-hidden="true" size={16} />
            </span>
            <div>
              <h3>{suggestion.title}</h3>
              <p>{suggestion.description}</p>
            </div>
          </div>
          <div className="task-badges">
            <span>{departmentLabels[suggestion.department]}</span>
            <span>{priorityLabels[suggestion.priority]}</span>
            <span>{workflowStatusLabels[suggestion.status]}</span>
          </div>
          <ul>
            {suggestion.subtasks.slice(0, 4).map((subtask) => (
              <li key={subtask}>{subtask}</li>
            ))}
          </ul>
          <div className="form-actions">
            <button
              className="secondary-action"
              onClick={() => setSuggestion(null)}
              type="button"
            >
              Reject
            </button>
            <button
              className="primary-action"
              onClick={(event) =>
                onAcceptSuggestion(suggestion, event.currentTarget)
              }
              type="button"
            >
              Review and edit
            </button>
          </div>
        </article>
      ) : null}
    </section>
  )
}
