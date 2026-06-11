Status: ready-for-agent

## Parent

`.scratch/yeti-v2/PRD.md`

## What to build

Implement **library snapshot** `version: 2` export per ADR 0009. `libraryToSnapshot` emits human YAML: per-workspace `bookmarks` with denormalized inline links (no top-level catalog, no `linkIds`, no order keys, no `placements.edgeGroups.left/top/bottom`). Settings export and `:export` action use v2 by default.

## Acceptance criteria

- [ ] Export produces `version: 2` YAML readable without cross-referencing IDs
- [ ] Round-trip: export v2 → import v2 preserves workspaces, groups, links, and order
- [ ] Theme, shortcuts, focus radio, internal tools, and canvas widget fields preserved
- [ ] UI download filename remains `yeti-snapshot.yaml` (or document if renamed)
- [ ] Tests cover export shape and round-trip fidelity

## Blocked by

- `.scratch/yeti-v2/issues/01-snapshot-v2-schema-import.md`
