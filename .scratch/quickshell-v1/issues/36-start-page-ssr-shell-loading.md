Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/issues/34-ssr-start-page-bootstrap.md`

## What to build

Replace the `/start` stub with a server-rendered start page shell:

- RSC page ships a real command bar `<input>` in the first HTML response
- Command bar receives autofocus on load
- Generic loading UI displays while the client checks IndexedDB (no catalog results yet)
- Subtle footer link to **home station** (`/home`)
- `/start` must not import or bundle full **shell** components (rims, canvas, tools, settings dialog)

Visual scope: command bar + **workspace** **theme** backdrop area (theme applied once IDB resolves — issue 37). Loading state is acceptable before theme is known.

## Acceptance criteria

- [ ] First HTML response for `/start` includes a focused command bar input (not blank page)
- [ ] Loading state visible before IndexedDB check completes
- [ ] Footer link navigates to `/home`
- [ ] `/start` page does not mount `Shell` or rim/canvas layers

## Blocked by

- `.scratch/quickshell-v1/issues/35-route-split-landing-home-start.md`

## Comments

Tracer bullet 2 of 5 for issue 34.
