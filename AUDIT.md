# Performance And Accessibility Audit

## Lighthouse Mobile

Record results after running Lighthouse in Chrome against the deployed production URL.

```text
Performance:
Accessibility:
Best Practices:
SEO:
Production URL:
Audit date:
```

### What To Test

1. Test the production home page at `/`.
2. Run one desktop Lighthouse audit.
3. Run one mobile Lighthouse audit.
4. Take screenshots of the Lighthouse results summary for both desktop and mobile.
5. Save screenshots or links in `docs/evidence/` and record the numbers above.

## Lighthouse Desktop

```text
Performance:
Accessibility:
Best Practices:
SEO:
Production URL:
Audit date:
```

## Accessibility Audit

```text
Tool:
WCAG violations:
Notes:
Screenshot/evidence:
Audit date:
```

### What To Check

1. Test `/` with WAVE or axe in Chrome.
2. Check the task creation dialog, AI planner panel, Kanban board, status selects, and filters.
3. Use mobile viewport around 375px wide and desktop viewport around 1280px wide.
4. Take screenshots of the tool results and any issue details.
5. Record violations and fixes in this document.

## Improvement Made

During implementation, status movement was implemented with native `<select>` controls before considering drag-and-drop. This keeps the core Kanban workflow accessible to keyboard, touch, and assistive-technology users and avoids making drag gestures the only way to move work.

The production accessibility audit identified three serious WCAG 2.1 AA contrast issues using the shared muted text color `#697386`. The shared muted tokens were darkened to `#596273`, which calculates to 5.73:1 on `#f5f7fb` and 5.49:1 on `#eef2ff`. Rerun Lighthouse and axe/WAVE after deployment to record final audited results.

## Manual Evidence Needed

Add evidence after manual audit:

- Lighthouse desktop screenshot
- Lighthouse mobile screenshot
- WAVE or axe screenshot
- Keyboard navigation notes
- Responsive layout screenshots
- AI success screenshot after configuring a real `OPENROUTER_API_KEY`
- AI missing-key/failure screenshot
