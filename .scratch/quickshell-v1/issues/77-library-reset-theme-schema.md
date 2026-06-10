Status: done

## Parent

`.scratch/quickshell-v1/PRD-preset-themes.md`

## What to build

Bump the **library** / **library snapshot** schema version for the new **theme** shape. Existing IndexedDB libraries on the old shape must not load silently — surface a clear message that **library reset** (or snapshot re-import) is required, consistent with pre-v1 upgrade policy in `CONTEXT.md`.

Ensure **library reset** re-seeds Work and Personal with the new starter themes. Update snapshot serialize/deserialize for the expanded theme fields.

## Acceptance criteria

- [x] Snapshot schema version incremented; old snapshots fail import with a clear unsupported-version error
- [x] Stale IndexedDB library on pre-preset theme shape does not partially load — user is directed to reset or import
- [x] **Library reset** produces Work and Personal with new theme shape from starter template
- [x] Round-trip snapshot export/import preserves `shellSurface`, `widgets`, and `appliedPresetId`
- [x] Tests cover version gate, reset seed, and snapshot round-trip

## Blocked by

- `.scratch/quickshell-v1/issues/72-preset-theme-model.md`
- `.scratch/quickshell-v1/issues/73-theme-preset-catalog.md`

## Comments

Tracer bullet 6 of preset-themes rework. No load-time theme migration — reset only (grill decision).
