import { NextResponse } from 'next/server'
import {
  AI_TASK_PLANNER_SYSTEM_PROMPT,
  parseTaskPlannerResponse,
} from '../../../../src/utils/aiTaskPlanner'

const OPENROUTER_API_URL =
  'https://openrouter.ai/api/v1/chat/completions'

const DEFAULT_MODEL = 'openrouter/free'
const MAX_INPUT_LENGTH = 2000

const getErrorStatus = (status: number) => {
  if (status === 429) {
    return {
      message:
        'The AI provider is rate limited right now. Please retry shortly.',
      status: 429,
    }
  }

  if (status >= 500) {
    return {
      message:
        'The AI provider is temporarily unavailable. Manual task creation still works.',
      status: 502,
    }
  }

  return {
    message:
      'The AI provider rejected the request. Please revise the input and retry.',
    status: 502,
  }
}

const readOpenRouterText = (payload: unknown) => {
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('choices' in payload) ||
    !Array.isArray(payload.choices)
  ) {
    return ''
  }

  const firstChoice = payload.choices[0]

  if (
    typeof firstChoice !== 'object' ||
    firstChoice === null ||
    !('message' in firstChoice) ||
    typeof firstChoice.message !== 'object' ||
    firstChoice.message === null ||
    !('content' in firstChoice.message)
  ) {
    return ''
  }

  const content = firstChoice.message.content

  return typeof content === 'string' ? content : ''
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Request body must be valid JSON.' },
      { status: 400 },
    )
  }

  const prompt =
    typeof body === 'object' &&
    body !== null &&
    'prompt' in body &&
    typeof body.prompt === 'string'
      ? body.prompt.trim()
      : ''

  if (!prompt) {
    return NextResponse.json(
      {
        error:
          'Describe the work you want AI to structure.',
      },
      { status: 400 },
    )
  }

  if (prompt.length > MAX_INPUT_LENGTH) {
    return NextResponse.json(
      {
        error:
          'Keep AI planning requests under 2,000 characters.',
      },
      { status: 400 },
    )
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      {
        error:
          'AI planning is unavailable until OPENROUTER_API_KEY is configured. Manual task creation still works.',
      },
      { status: 503 },
    )
  }

  const controller = new AbortController()

  const timeoutId = setTimeout(
    () => controller.abort(),
    20_000,
  )

  try {
    const response = await fetch(
      OPENROUTER_API_URL,
      {
        method: 'POST',
        signal: controller.signal,

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer':
            process.env.NEXT_PUBLIC_APP_URL ??
            'http://localhost:3000',
          'X-Title': 'TaskFlow AI',
        },

        body: JSON.stringify({
          model:
            process.env.OPENROUTER_MODEL ??
            DEFAULT_MODEL,

          temperature: 0.2,

          max_tokens: 900,

          messages: [
            {
              role: 'system',
              content:
                AI_TASK_PLANNER_SYSTEM_PROMPT,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      const error = getErrorStatus(
        response.status,
      )

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: error.status,
        },
      )
    }

    const payload: unknown =
      await response.json()

    const content =
      readOpenRouterText(payload)

    if (!content) {
      return NextResponse.json(
        {
          error:
            'AI returned an empty response. Please retry or create the task manually.',
        },
        {
          status: 502,
        },
      )
    }

    const parsed =
      parseTaskPlannerResponse(content)

    if (!parsed.ok) {
      return NextResponse.json(
        {
          error:
            'AI returned a response TaskFlow could not safely use. Please retry or create the task manually.',
          reason: parsed.error,
        },
        {
          status: 502,
        },
      )
    }

    return NextResponse.json({
      suggestion: parsed.suggestion,
    })
  } catch (caughtError) {
    const isTimeout =
      caughtError instanceof Error &&
      caughtError.name === 'AbortError'

    return NextResponse.json(
      {
        error: isTimeout
          ? 'AI planning timed out. Please retry or create the task manually.'
          : 'AI planning failed. Please retry or create the task manually.',
      },
      {
        status: 502,
      },
    )
  } finally {
    clearTimeout(timeoutId)
  }
}