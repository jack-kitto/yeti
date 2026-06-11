Status: ready-for-human

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Deploy **Yeti** to **Cloudflare Pages** by connecting the GitHub repo in the Cloudflare dashboard. Cloudflare builds and deploys `main` on each push — no GitHub deploy workflow required.

**Superseded for launch scope** by `.scratch/public-preview/PRD.md` and issue 05 in that directory. OpenNext adapter (public-preview issue 04) required before first production deploy.

**Recommendation:** Cloudflare Pages (not Workers) for this Next.js static/SSR app. Use the official Next.js on Pages adapter or static export, whichever fits the current App Router setup after a quick spike.

Human steps in Cloudflare dashboard:

1. Create Pages project → Connect to GitHub → select this repo
2. Build command: `npm run build` (adjust if adapter adds a step)
3. Output directory: `.next` or adapter output (document the chosen value)
4. Production branch: `main`
5. Preview deployments on PRs (optional but recommended)

Document the chosen build settings in the repo README so agents don't duplicate a deploy action.

## Acceptance criteria

- [ ] Production URL is live on Cloudflare Pages
- [ ] Pushing to `main` triggers an automatic Cloudflare build/deploy
- [x] README documents Cloudflare build settings and that deploy is dashboard-driven
- [ ] No redundant GitHub Actions deploy workflow (release workflow from issue 23 is separate)

## Blocked by

- `.scratch/quickshell-v1/issues/22-github-actions-ci.md`
