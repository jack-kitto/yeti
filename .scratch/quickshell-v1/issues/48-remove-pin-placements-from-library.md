Status: done

## Parent

`.scratch/quickshell-v1/issues/32-canvas-center-widgets.md`

## What to build

Remove **pin strip** placements from the **library** schema, **starter template**, snapshot format, and placement mutations now that pins are out of v1 (issues 03, 10 → wontfix; UI removed in issue 32).

Migrate or strip `placements.pins` on load; stop seeding pin data in the starter template. Update validation and tests. Document reset/snapshot as upgrade path per ADR 0001.

## Acceptance criteria

- [x] `WorkspacePlacements` no longer includes pins (or loads legacy snapshots by dropping pin data)
- [x] Starter template seeds zero pins
- [x] Snapshot round-trip no longer reads/writes pin placements
- [x] Placement/settings UI and shell no longer reference pin mutations
- [x] Existing tests updated; no dead pin-strip code paths remain

## Blocked by

None — pin UI already removed

## Comments

Schema/doc drift after issue 32. Pair with issue 47 for ADR wording.
