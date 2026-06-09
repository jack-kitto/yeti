Status: done

## Parent

`.scratch/quickshell-v1/issues/27-top-rim-control-center.md`

## What to build

**Focus radio** library schema and **settings** CRUD: global (not per-workspace) station list with `label`, `url`, `kind` (`stream` | `youtube`), optional `imageUrl`, reorder, and persistence of last station, volume, mute, and playing state. Stations from library snapshot or settings only — no local file seeding. Empty starter template; setup prompt when no stations.

## Acceptance criteria

- [x] Library stores user stations and focus radio playback preferences globally
- [x] Settings UI adds, edits, removes, and reorders stations
- [x] Snapshot export/import round-trips radio preferences
- [x] Starter library ships with no stations

## Blocked by

- `.scratch/quickshell-v1/issues/40-control-center-workspaces-tab.md`

## Comments

Tracer bullet 3 of 4 for issue 27.
