Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/issues/34-ssr-start-page-bootstrap.md`

## What to build

Verify and enforce bundle separation between surfaces:

- `/start` cold open must not download the full **shell** JS chunk (rims, canvas, edge layers, internal tools, settings dialog)
- `/home` retains the complete shell bundle
- Add a test, build analysis step, or documented verification that `/start` entry is lean

If shell code is currently pulled in via shared imports, refactor shared boundaries so `/start` only imports command bar + library + theme utilities.

## Acceptance criteria

- [ ] `/start` initial JS payload excludes full shell modules (verified via build analyzer output or equivalent test)
- [ ] `/home` still loads full **shell** without regression
- [ ] Verification approach documented in issue comment or README note if non-obvious

## Blocked by

- `.scratch/quickshell-v1/issues/37-start-page-idb-search-fallback.md`

## Comments

Tracer bullet 5 of 5 for issue 34.
