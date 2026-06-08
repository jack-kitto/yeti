Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Add **placement** management to the **config panel**.

Per **workspace**, assign **catalog** links to left, top, and bottom **edges** and to **pins**. Reorder links within each edge group (order determines which 8 appear in the flyout). Allow the same link on multiple edges within a workspace. Placements are independent per workspace — same catalog link, different surfaces in Work vs Personal.

Changes persist via Library module patches.

## Acceptance criteria

- [ ] Config UI assigns links to left, top, bottom edges for the selected workspace
- [ ] Config UI assigns links as canvas pins for the selected workspace
- [ ] User can reorder links within each edge group; top 8 reflect flyout preview order
- [ ] Same catalog link can be placed on multiple edges in one workspace
- [ ] Work and Personal can have different placements for the same catalog link
- [ ] Placement changes are reflected in edge flyouts and pin strip after save

## Blocked by

- `.scratch/quickshell-v1/issues/06-config-link-catalog.md`
- `.scratch/quickshell-v1/issues/02-edge-link-menus.md`
- `.scratch/quickshell-v1/issues/03-canvas-pin-strip.md`
