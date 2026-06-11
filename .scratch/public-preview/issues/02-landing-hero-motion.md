Status: wontfix

## Parent

`.scratch/public-preview/PRD.md`

## What to build

Superseded by `.scratch/yeti-v2/issues/10-landing-scroll-linked-notch-video.md` — scroll-scrubbed **edge flyout** demo (bookmark notch opening) with poster fallback when `prefers-reduced-motion` is set.

Original scope: optional muted autoplay video loop on the **landing page** hero — edge notch hover clip from demo assets.

Ship optimized clip in `public/landing/` (short loop, &lt;2MB target). No impact on **home station** bundle.

## Acceptance criteria

- [ ] Landing hero shows motion on supporting browsers when reduced-motion is off
- [ ] Still image remains poster and fallback
- [ ] `prefers-reduced-motion: reduce` shows static image only
- [ ] Landing content module exposes video src when asset present (or component reads known path)
- [ ] `npm test` and `npm run build` pass

## Blocked by

None — can start immediately
