# TaskFlow AI

TaskFlow AI is an accessible work-management application for individuals and small teams. It organizes work across departments and workflow stages, and includes an AI Task Planner that turns rough requirements into structured tasks users can review, edit, accept, or reject.

## Overview

The app is a small Jira/Linear/Asana-inspired task workspace built with Next.js App Router, React, TypeScript, Tailwind CSS, and browser localStorage. It preserves the original TaskFlow assignment behavior while adding department spaces, Kanban workflow management, richer task details, tests, and production documentation.

Production URL: https://flyrank-ai-react-assignment.vercel.app

## Problem

Basic todo lists are easy to start but become hard to scan once work spans multiple teams, priorities, owners, and workflow stages. TaskFlow AI gives that work a clearer structure without trying to become a full enterprise project-management platform.

## Target Users

TaskFlow AI is designed for students, freelancers, internship teams, and small teams that need lightweight planning across departments such as Marketing, Technical, Finance, Design, Sales, Operations, and HR.

## Why This Project

Project planning is a practical use case for AI because users often begin with vague requirements. The AI assistant reduces repetitive structuring work while keeping the user in control of the final task.

## Features

- Department spaces in a left sidebar
- Kanban workflow with Backlog, To Do, In Progress, Review, and Done
- Manual task create, edit, delete, detail view, and status movement
- Accessible native status selects as the primary task movement method
- Search by title, description, labels, assignee, and department
- Filters for status, priority, due date, and assignee
- Overview statistics and department progress calculated from task state
- Labels, subtasks, due dates, assignees, priorities, and AI-assisted flags
- Backward-compatible localStorage migration for older TaskFlow tasks
- Server-side AI Task Planner route
- Structured AI output validation and safe failure states
- Responsive layout with local Kanban scrolling on small screens

## AI Task Planner

The AI Task Planner accepts a rough project requirement and asks a server-side OpenRouter-compatible chat model to return one structured task. The suggestion includes title, description, department, priority, status, labels, subtasks, optional due date, and optional assignee.

The suggestion is never saved automatically. Users must review it, can edit every field, and can reject it before creating a task.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS plus scoped CSS
- lucide-react icons
- Radix/shadcn dialog primitive
- Vitest
- Testing Library
- Browser localStorage
- OpenRouter chat completions through a server-side route

## Architecture

TaskFlow AI keeps the interactive task workspace as a Client Component because it uses React state, browser storage, and user interactions. Server routes stay inside `app/api`.

Important files:

- `app/page.tsx` renders the TaskFlow AI workspace.
- `app/layout.tsx` defines metadata and shared navigation.
- `app/api/health/route.ts` preserves the previous health endpoint.
- `app/api/ai/task-planner/route.ts` keeps AI calls server-side.
- `src/components/TaskFlowApp.tsx` owns app-level state and orchestration.
- `src/components/taskflow/` contains focused workspace components.
- `src/components/TaskForm.tsx` contains the reusable accessible task editor.
- `src/types/task.ts` defines departments, statuses, priorities, task data, filters, and AI suggestions.
- `src/utils/taskStorage.ts` loads, saves, and migrates localStorage task data.
- `src/utils/taskAnalytics.ts` calculates filters, counts, overdue state, and department progress.
- `src/utils/aiTaskPlanner.ts` stores the production prompt and validates structured AI output.

## Project Structure

```text
app/
  api/
    ai/task-planner/route.ts
    health/route.ts
  health/page.tsx
  layout.tsx
  page.tsx
src/
  components/
    taskflow/
    TaskFlowApp.tsx
    TaskForm.tsx
  types/
  utils/
playground/
  components/accessible pattern exercises
docs/evidence/
  testing and audit evidence instructions
```

## Task Data Model

A task contains:

```ts
id
title
description
department
status
priority
labels
subtasks
dueDate
createdAt
updatedAt
assignee
aiAssisted
aiGenerated
completed
```

## Departments and Workflow

Departments and statuses are separate concepts. A task can belong to Marketing while being In Progress, or belong to Technical while being in Review.

Supported departments:

```text
Marketing, Technical, Finance, Design, Sales, Operations, HR
```

Supported workflow statuses:

```text
Backlog, To Do, In Progress, Review, Done
```

## AI Architecture

The browser calls only the local Next.js endpoint:

```text
/api/ai/task-planner
```

The route reads `OPENROUTER_API_KEY` from the server environment, calls OpenRouter at `https://openrouter.ai/api/v1/chat/completions`, parses the selected model response, validates it, and returns only safe structured task data to the client.

## OpenRouter Integration

Required server-side environment variable:

```bash
OPENROUTER_API_KEY=
```

Optional model variable:

```bash
OPENROUTER_MODEL=openrouter/free
```

The API request uses Bearer authorization, sends `HTTP-Referer` from `NEXT_PUBLIC_APP_URL`, and keeps the secret out of browser JavaScript.

## Prompt Strategy

The production prompt lives in `src/utils/aiTaskPlanner.ts`. It instructs the model to act as a project-management assistant, use only supported TaskFlow departments/statuses/priorities, avoid inventing dates, keep subtasks actionable, and return only JSON in the requested shape.

## Structured Output Validation

TaskFlow AI does not trust raw LLM output. It validates:

- required title and description
- allowed departments
- allowed priorities
- allowed statuses
- label and subtask arrays
- due date format
- malformed JSON
- unexpected provider response shapes
- empty provider responses

## Safe Failure / Error Handling

The AI feature handles empty input, overly long input, missing OpenRouter key, provider errors, rate limits, timeouts, malformed output, invalid structured output, duplicate submit attempts, and empty responses. Normal manual task management continues to work when AI is unavailable.

## Accessibility

The app uses semantic navigation, labeled inputs, native selects for status movement, visible focus states, accessible validation errors, progress elements, button labels, live announcements for task changes, and a Radix-backed modal dialog for focus containment and Escape handling. The previous accessibility playground work remains in `playground/`.

## Testing

Run:

```bash
npm test
```

Automated coverage includes task migration, filtering/stat calculations, AI structured validation, AI API safe failures, task creation, invalid form submission, editing, deleting, status movement, department filtering, search, duplicate AI request prevention, and accepting/editing AI suggestions before creation.

## Coverage

Run:

```bash
npm run test:coverage
```

Record the latest measured result in your submission evidence. The configured threshold is 50% for statements, branches, functions, and lines.

Latest verified result:

```text
Statements: 72.44%
Branches: 62.50%
Functions: 71.25%
Lines: 71.86%
Component lines: 75.17%
```

Evidence is stored in `docs/evidence/tests-passing.png` and `docs/evidence/coverage-report.png`.

## Production Audit

Final Lighthouse production audit from 2026-09-01:

```text
Performance: 100
Accessibility: 100
Best Practices: 100
SEO: 100
```

Final axe DevTools WCAG 2.1 AA production scan:

```text
Total automatic issues: 0
Critical: 0
Serious: 0
Moderate: 0
Minor: 0
```

The first accessibility audit found three serious contrast issues using the shared muted text color `#697386`. The shared muted tokens were updated to `#596273`, improving Lighthouse Accessibility from 96 to 100 and reducing axe DevTools issues from 3 serious issues to 0 automatic issues.

## Performance

The app avoids drag-and-drop libraries, heavy animation packages, large images, and client-side API keys. The Kanban board uses native controls and local state. Generated coverage output is ignored from Git.

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Required for AI:

```bash
OPENROUTER_API_KEY=your_real_key_here
```

Optional:

```bash
OPENROUTER_MODEL=openrouter/free
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Never commit real API keys.

## Local Development

```bash
git clone https://github.com/davud87/flyrank-ai-react-assignment.git
cd flyrank-ai-react-assignment
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm install
npm run lint
npm test
npm run test:coverage
npm run build
```

## Deployment

The repository is connected to Vercel. Configure `OPENROUTER_API_KEY` in the Vercel project environment before testing AI in production. Optionally configure `OPENROUTER_MODEL` and `NEXT_PUBLIC_APP_URL`. Keep the framework preset as Next.js and the build command as `next build`.

Production deployment:

```text
https://flyrank-ai-react-assignment.vercel.app
```

## Monitoring

Use lightweight monitoring appropriate for the capstone:

- Vercel deployment status and build logs
- Vercel function logs for `/api/ai/task-planner`
- Browser console checks during manual QA
- Optional Vercel Analytics if already enabled

If AI fails in production, check whether `OPENROUTER_API_KEY` is configured, whether OpenRouter returned a non-200 response, whether the route rejected malformed output, and whether the client still allows manual task creation.

## Rollback Plan

For Vercel, identify the previous stable deployment and promote or redeploy it. For a source rollback, revert the offending commit, push the revert to `main`, wait for the new deployment, then verify `/`, `/health`, `/api/health`, and manual task creation.

## Known Limitations

- Single-user browser localStorage persistence
- No authentication
- No real-time collaboration
- AI requires a configured OpenRouter API key
- No advanced permissions
- No sprint, epic, or full Jira-style hierarchy
- No production database
- npm audit currently requires a semver-major Next.js upgrade to fully resolve reported findings
- `next build` can show a non-blocking ESLint plugin detection warning even though standalone lint passes

## Future Improvements

- Persist tasks in a backend database
- Add authentication and team workspaces
- Add optional drag-and-drop only after accessible controls remain covered
- Add richer audit evidence with Lighthouse and WAVE/axe screenshots
- Revisit Next.js major-version upgrade after capstone submission
