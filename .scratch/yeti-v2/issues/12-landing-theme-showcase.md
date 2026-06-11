Status: ready-for-agent

## Parent

`.scratch/yeti-v2/PRD.md`

## What to build

Showcase multiple **theme presets** on the **landing page** — e.g. a horizontal strip or grid of static screenshots (Work, Personal, Editorial, Forest, Sunset, Ocean) with short labels. Assets from production captures or WebReel; copy ties to **control center** quick-apply on `/home`.

Update `getLandingPageContent` with a `themeShowcase` array; extend landing component and tests.

## Acceptance criteria

- [ ] At least four distinct theme previews visible on landing
- [ ] Mobile layout readable (stack or horizontal scroll)
- [ ] Copy uses **theme preset** domain term
- [ ] `landing-page.test.ts` covers showcase content structure

## Blocked by

- `.scratch/yeti-v2/issues/11-landing-hero-production-capture.md` (shared capture workflow; can parallelize with placeholders)
