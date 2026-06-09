Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/issues/27-top-rim-control-center.md`

## What to build

**Focus radio** library schema and **settings** CRUD: global (not per-workspace) station list with `label`, `url`, `kind` (`stream` | `youtube`), optional `imageUrl`, reorder, and persistence of last station, volume, mute, and playing state. Optional gitignored local YAML seed for dev. Empty starter template; setup prompt when no stations.

## Acceptance criteria

- [ ] Library stores user stations and focus radio playback preferences globally
- [ ] Settings UI adds, edits, removes, and reorders stations
- [ ] Snapshot export/import round-trips radio preferences
- [ ] Starter library ships with no stations

## Blocked by

- `.scratch/quickshell-v1/issues/40-control-center-workspaces-tab.md`

## Comments

Tracer bullet 3 of 4 for issue 27.
