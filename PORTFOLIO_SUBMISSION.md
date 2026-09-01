# Portfolio Submission

## Project Brief

TaskFlow AI is an accessible work-management application for individuals and small teams that need to organize work across departments and workflow stages. It combines a Kanban workflow with an AI planning assistant that converts rough requirements into structured tasks with suggested departments, priorities, labels, and actionable subtasks while keeping the user in control through review and editing before creation. I chose this idea because project planning is a practical workflow where AI can reduce repetitive organization work without replacing user decisions.

## Live Application

https://flyrank-ai-react-assignment.vercel.app

## Repository

https://github.com/davud87/flyrank-ai-react-assignment

## Testing Evidence

```text
8/8 test files passing
21/21 automated tests passing
Component line coverage: 75.17%
```

Evidence:

- `docs/evidence/tests-passing.png`
- `docs/evidence/coverage-report.png`

## Performance & Accessibility

Final production Lighthouse audit:

```text
Performance: 100
Accessibility: 100
Best Practices: 100
SEO: 100
```

Final axe DevTools production scan:

```text
WCAG standard: WCAG 2.1 AA
Total automatic issues: 0
Critical: 0
Serious: 0
Moderate: 0
Minor: 0
```

Audit-driven improvement:

```text
Initial Lighthouse Accessibility: 96
Final Lighthouse Accessibility: 100
Initial axe issues: 3 serious contrast issues
Final axe issues: 0
Muted text token: #697386 -> #596273
```

Evidence:

- `docs/evidence/lighthouse-evidence.png`
- `docs/evidence/lighthouse-final-evidence.png`
- `docs/evidence/axe-accessibility-evidence.png`

## Deployment & Operation

TaskFlow AI is deployed on Vercel. The AI planner uses OpenRouter through a server-side Next.js API route, with `OPENROUTER_API_KEY` stored as a Vercel environment variable. The browser never receives the secret key.

The manual task workflow remains available if the AI provider is missing, rate-limited, timed out, unavailable, or returns malformed data. Structured AI responses are validated before becoming editable task suggestions. Rollback can use a previous stable Vercel deployment or a Git revert followed by a verified redeploy.

Evidence:

- `docs/evidence/production-app.png`
- `docs/evidence/ai-planner-production.png`
- `DEPLOYMENT_CHECKLIST.md`
- `AUDIT.md`

## Reflection

See `REFLECTION.md`.
