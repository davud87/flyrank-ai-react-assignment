# Evidence Folder

This folder contains real evidence collected for the TaskFlow AI capstone submission.

## Files

`ai-planner-production.png`

Production AI planner generating structured task suggestions through OpenRouter.

`axe-accessibility-evidence.png`

Final axe DevTools WCAG 2.1 AA production scan showing 0 automatic issues.

`coverage-report.png`

Vitest coverage report showing overall coverage and component line coverage above the 50% capstone requirement.

`lighthouse-evidence.png`

Initial production Lighthouse audit evidence showing the accessibility issue before the contrast fix.

`lighthouse-final-evidence.png`

Final production Lighthouse audit evidence showing 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO.

`production-app.png`

Final deployed TaskFlow AI application.

`tests-passing.png`

Final automated test run showing 8/8 test files and 21/21 tests passing.

## Notes

Generated coverage HTML is intentionally not committed. The `coverage/` directory is ignored by Git and can be regenerated with:

```bash
npm run test:coverage
```
