Status: ready-for-agent

## Parent

`.scratch/public-preview/PRD.md`

## What to build

Wire Yeti for **Cloudflare Pages** full-stack Next.js deploy using the OpenNext Cloudflare adapter so API routes (`/api/focus-radio/stream`, `/api/calendar/ics`) work in production.

Add wrangler config, adapter build script, and Edge-compatible runtime exports on server routes where required. Update README deployment section with final build command and output directory — no GitHub Actions deploy workflow.

## Acceptance criteria

- [ ] Local `npm run build` (or documented adapter build command) produces Cloudflare-compatible output
- [ ] Focus radio stream proxy route works on `wrangler pages dev` or documented preview command
- [ ] Calendar ICS route works on preview
- [ ] README deployment table matches actual build settings
- [ ] `npm test` pass
- [ ] No Vercel-specific config added

## Blocked by

None — can start immediately
