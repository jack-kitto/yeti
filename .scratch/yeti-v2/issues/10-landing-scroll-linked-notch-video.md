Status: ready-for-agent

## Parent

`.scratch/yeti-v2/PRD.md`

## What to build

Add a scroll-driven demo section on the **landing page**: as the user scrolls, a video scrubs through a left-rim **edge handle** hover → **edge flyout** open sequence (bookmark notch opening). Record clip from production build via WebReel/demo pipeline — no Next.js dev overlay.

- Poster still for `prefers-reduced-motion: reduce`
- Video asset in `public/landing/` (target &lt;2MB, short loop or single take)
- Landing content module exposes video src + scroll section copy
- Does not affect **home station** bundle size

## Acceptance criteria

- [ ] Landing section plays/scrubs notch-open video on scroll when motion allowed
- [ ] Reduced motion shows static poster only
- [ ] Clip shows **edge flyout** opening (not control center or command bar)
- [ ] `npm test` and `npm run build` pass; landing tests extended

## Blocked by

None — can start immediately
