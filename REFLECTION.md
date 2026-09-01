# Reflection

## What was hardest and why?

The hardest part was balancing AI assistance with product safety. A task planner sounds simple until the app has to treat model output as untrusted data. The AI can return malformed JSON, unsupported departments, invented dates, or fields with the wrong shape, so the route needs validation and safe error handling before the UI can use anything. Migrating the provider details to OpenRouter also showed why documentation and tests need to follow the real implementation, not an earlier assumption. The second hard part was keeping the Kanban board accessible. Drag-and-drop would look impressive, but native status controls are more reliable for keyboard and touch users, so I prioritized that path first.

## What would I do differently next time?

Next time I would define the richer task data model and provider boundary before building the first version of the UI. The original TaskFlow model was good for a todo app, but adding departments, workflow status, labels, due dates, subtasks, assignees, and AI flags required careful migration so older localStorage data would not break. I would also add production component tests earlier so the user workflows are protected before the interface grows.

## One thing I learned that surprised me

Production frontend work is much more than making the screen look polished. The capstone needed validation, failure states, accessibility, testing, coverage, documentation, deployment planning, rollback notes, and honest limitations. The AI feature made that especially clear because the app has to keep working even when the most exciting feature is unavailable.
