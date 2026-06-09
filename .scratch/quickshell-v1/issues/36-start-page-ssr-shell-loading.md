Status: done

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

- [x] First HTML response for `/start` includes a focused command bar input (not blank page)
- [x] Loading state visible before IndexedDB check completes
- [x] Footer link navigates to `/home`
- [x] `/start` page does not mount `Shell` or rim/canvas layers

## Blocked by

- `.scratch/quickshell-v1/issues/35-route-split-landing-home-start.md`

## Comments

Tracer bullet 2 of 5 for issue 34.

Shipped in `feat(start-page): add SSR command bar shell with loading gate`.
