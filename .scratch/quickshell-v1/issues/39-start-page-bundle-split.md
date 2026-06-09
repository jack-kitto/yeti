Status: done

## Parent

`.scratch/quickshell-v1/issues/34-ssr-start-page-bootstrap.md`

## What to build

Verify and enforce bundle separation between surfaces:

- `/start` cold open must not download the full **shell** JS chunk (rims, canvas, edge layers, internal tools, settings dialog)
- `/home` retains the complete shell bundle
- Add a test, build analysis step, or documented verification that `/start` entry is lean

If shell code is currently pulled in via shared imports, refactor shared boundaries so `/start` only imports command bar + library + theme utilities.

## Acceptance criteria

- [x] `/start` initial JS payload excludes full shell modules (verified via build analyzer output or equivalent test)
- [x] `/home` still loads full **shell** without regression
- [x] Verification approach documented in issue comment or README note if non-obvious

## Blocked by

- `.scratch/quickshell-v1/issues/37-start-page-idb-search-fallback.md`

## Comments

Tracer bullet 5 of 5 for issue 34.

Shipped in `test(routing): enforce start page shell bundle boundaries`.

**Verification:** `src/routing/surface-boundaries.test.ts` walks the transitive import graph from `src/app/start/page.tsx` and fails if any `SHELL_ONLY_MODULES` entry appears (shell root, canvas, edge layer, config dialog, launcher, dashboard, pin strip, `shell-frame/`). Home station entry must reach `shell.tsx`. Run `npm run verify:surface-boundaries`. Production build (2026-06): `/start` page 1.98 kB / 145 kB first-load JS vs `/home` 20.6 kB / 167 kB.
