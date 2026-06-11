Status: ready-for-human

## Parent

`.scratch/yeti-v2/PRD.md`

## What to build

Re-capture `public/landing/hero.png` from a production build (`npm run build && npm start` or deployed URL) so the hero has no Next.js dev FAB or dev-only chrome. Update `heroImageAlt` if the frame changes.

Optional: replace static hero with scroll-video section (issue 10) as primary visual — coordinate so both assets are consistent.

## Acceptance criteria

- [ ] Hero PNG captured from production, not `npm run dev`
- [ ] Open Graph / Twitter metadata still resolve absolute image URL
- [ ] No dev tools or debug overlays visible in crop

## Blocked by

None — can start immediately
