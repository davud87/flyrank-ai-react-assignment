# Deployment Checklist

## Verified

- [x] Dependencies install successfully with `npm install`
- [x] Lint passes with `npm run lint`
- [x] Automated tests pass with `npm test`
- [x] Coverage requirement verified with `npm run test:coverage`
- [x] Production build succeeds with `npm run build`
- [x] Environment variables documented
- [x] OpenRouter production environment configured in Vercel
- [x] No secrets committed
- [x] AI failure state verified through automated tests
- [x] AI success state verified in production
- [x] Lighthouse audit completed
- [x] Accessibility audit completed with axe DevTools
- [x] Production deployment verified
- [x] Live application URL added to `PORTFOLIO_SUBMISSION.md`
- [x] GitHub repository URL confirmed in `PORTFOLIO_SUBMISSION.md`
- [x] Rollback procedure documented

## Still To Verify Manually If Requested By Reviewer

- [ ] Responsive layouts checked in Chrome at mobile, tablet, and desktop widths with separate screenshots
- [ ] Keyboard navigation walkthrough documented with screenshots or notes

## Production

Live application:

```text
https://flyrank-ai-react-assignment.vercel.app
```

## Vercel Environment

Configured in Vercel:

```bash
OPENROUTER_API_KEY=configured server-side
OPENROUTER_MODEL=openrouter/free
NEXT_PUBLIC_APP_URL=https://flyrank-ai-react-assignment.vercel.app
```

The real `OPENROUTER_API_KEY` value must remain secret and must not be committed.

## Vercel Rollback

1. Open the Vercel project deployments list.
2. Identify the latest known stable deployment.
3. Promote or redeploy that previous stable deployment.
4. Verify `/`, `/health`, AI safe-failure behavior, and normal task creation.
5. If the issue came from source code, revert the offending commit, push the revert to `main`, and verify the new production deployment.

## Known Notes

- `npm audit` reports findings through the direct production dependency `next` and its nested `postcss`. npm's offered fix is a semver-major Next.js upgrade, so it was not force-applied during capstone cleanup.
- `next build` may print "The Next.js plugin was not detected in your ESLint configuration" even though `npm run lint` passes with `@next/eslint-plugin-next`. The warning is non-blocking for this build.
