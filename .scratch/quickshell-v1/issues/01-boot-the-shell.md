Status: done

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Scaffold the Quickshell app and prove the core data loop end-to-end.

Set up Next.js (App Router), TypeScript, Tailwind, shadcn/ui, Framer Motion, Zustand, and TanStack Query. Render the full-viewport **shell** layout: central **canvas** plus hit zones for left, top, bottom, and right edges. No traditional navbar or sidebar.

Implement the **Library** deep module: load, save, and patch the full **library** aggregate (link catalog, workspaces, themes, placements, pin positions, shortcut bindings, active workspace id) via IndexedDB. Seed the **starter template** on first run when IndexedDB is empty — Work and Personal **workspaces**, distinct **themes**, sample dev **links**, and placements on all edges and the pin strip.

Implement the **Theme** module to map workspace theme tokens to CSS custom properties on the shell root. Show a **workspace switcher** on the canvas; switching workspace updates the active theme immediately.

Add Library module unit tests (Vitest + fake-indexeddb or injectable in-memory adapter).

## Acceptance criteria

- [x] App runs on localhost with a spatial shell layout (canvas + four edge zones), no dashboard chrome
- [x] First visit seeds the starter template into IndexedDB; subsequent visits load persisted data
- [x] Active workspace theme (palette, background image URL, glass styling) applies to the shell
- [x] Workspace switcher on canvas toggles Work ↔ Personal; theme updates on switch
- [x] Library module tests cover load, save, patch, and starter seed invariants

## Blocked by

None — can start immediately
