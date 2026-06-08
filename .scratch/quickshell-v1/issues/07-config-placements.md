Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Add **placement** management to the **config panel**.

Per **workspace**, CRUD **edge groups** (name, handle icon, edge assignment, **fractional order**). Assign and reorder catalog links within each group. **Edge slot rail** per edge for precise handle positioning (same data as drag-on-rim in issue 15). Assign **pins** to canvas with fractional strip order.

Allow the same catalog link in multiple edge groups. Placements are independent per workspace.

## Acceptance criteria

- [ ] Config UI creates, edits, and deletes edge groups per workspace
- [ ] User sets group name and handle icon (image, emoji, or initials fallback)
- [ ] Slot rail reorders groups along an edge (fractional order keys)
- [ ] User assigns and reorders links within each edge group
- [ ] Config UI assigns canvas pins for the selected workspace
- [ ] Same catalog link can appear in multiple edge groups in one workspace
- [ ] Work and Personal can have different placements for the same catalog link
- [ ] Placement changes reflect on shell handles, flyouts, and pin strip after save

## Blocked by

- `.scratch/quickshell-v1/issues/06-config-link-catalog.md`
- `.scratch/quickshell-v1/issues/15-edge-handles-and-flyouts.md`
- `.scratch/quickshell-v1/issues/03-canvas-pin-strip.md`
