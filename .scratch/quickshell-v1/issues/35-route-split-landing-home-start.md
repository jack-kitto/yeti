Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/issues/34-ssr-start-page-bootstrap.md`

## What to build

Introduce the three-route layout from ADR 0004:

- **`/`** — minimal **landing page**: product name, one-liner, primary CTA linking to `/home`
- **`/home`** — move the current full **shell** entry here (today's root `page.tsx` behavior)
- **`/start`** — new route; stub page OK in this slice (placeholder or empty RSC is fine — filled in issue 36)

Root `/` must no longer mount `Shell` directly. Existing bookmarks to `/` will hit the landing page instead of the shell — acceptable per product decision.

## Acceptance criteria

- [ ] Navigating to `/` shows landing content, not the shell or a loading gate
- [ ] Navigating to `/home` mounts the full **shell** with existing behavior
- [ ] `/start` route exists and renders (stub acceptable)
- [ ] No regressions to shell functionality on `/home`

## Blocked by

None — can start immediately

## Comments

Tracer bullet 1 of 5 for issue 34.
