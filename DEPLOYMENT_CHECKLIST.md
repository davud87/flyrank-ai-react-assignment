# Deployment Checklist

## Verified By Codex

- [x] Dependencies install successfully with `npm install`
- [x] Lint passes with `npm run lint`
- [x] Automated tests pass with `npm test`
- [x] Coverage requirement verified with `npm run test:coverage`
- [x] Production build succeeds with `npm run build`
- [x] Environment variables documented
- [x] No secrets committed
- [x] AI failure state verified through automated tests
- [x] Rollback procedure documented

## Still To Verify Before Submission

- [ ] Production environment variable `OPENROUTER_API_KEY` configured in Vercel
- [ ] Responsive layouts checked in Chrome at mobile, tablet, and desktop widths
- [ ] Keyboard navigation checked manually
- [ ] Accessibility audit completed with WAVE or axe
- [ ] Lighthouse audit completed
- [ ] AI success state verified against a real API key
- [ ] Production deployment verified
- [ ] Live application URL added to `PORTFOLIO_SUBMISSION.md`
- [ ] GitHub repository URL confirmed in `PORTFOLIO_SUBMISSION.md`

## Vercel Rollback

1. Open the Vercel project deployments list.
2. Identify the latest known stable deployment.
3. Promote or redeploy that deployment.
4. Verify `/`, `/health`, and normal task creation.
5. If the issue came from source code, revert the offending commit, push the revert to `main`, and verify the new production deployment.

## Known Pre-Deployment Notes

- `npm audit` reports findings through the direct production dependency `next` and its nested `postcss`. npm's offered fix is a semver-major Next.js upgrade, so it is not force-applied during final capstone cleanup.
- `next build` may print "The Next.js plugin was not detected in your ESLint configuration" even though `npm run lint` passes with `@next/eslint-plugin-next`. The warning is non-blocking for this build; avoiding it cleanly would require changing the ESLint toolchain shape close to submission.

## Environment

Configure these locally and in Vercel:

```bash
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openrouter/free
NEXT_PUBLIC_APP_URL=
```
