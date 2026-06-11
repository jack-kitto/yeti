Status: ready-for-agent

## Parent

`.scratch/public-preview/PRD.md`

## What to build

Add a minimal landing footer: link to public GitHub repo (`jack-kitto/yeti`), **local tier** one-liner, optional link to `CONTEXT.md` on GitHub for terminology-curious visitors.

Mobile layout pass on landing — verify headline, CTAs, hero, and feature grid on narrow viewports without horizontal scroll.

## Acceptance criteria

- [ ] Footer visible on `/` with GitHub repo link
- [ ] Local-tier disclaimer present in footer or existing note (not duplicated awkwardly)
- [ ] Landing readable at 390px viewport width
- [ ] Content module includes footer strings for testability
- [ ] `npm test` and `npm run build` pass

## Blocked by

None — can start immediately
