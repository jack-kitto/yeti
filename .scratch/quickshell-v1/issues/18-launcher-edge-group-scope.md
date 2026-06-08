Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Update the **launcher** to open scoped to a specific **edge group** (not a whole edge position). "See more" on a flyout passes the group id; launcher shows that group's full link list. **Full catalog** toggle unchanged.

Re-wire edge flyout → launcher after issue 15 changes handle/flyout components.

## Acceptance criteria

- [ ] "See more" opens launcher filtered to the invoking edge group's links
- [ ] Launcher header or scope label shows the edge group name
- [ ] Full catalog toggle still works
- [ ] In-launcher filter still narrows visible links

## Blocked by

- `.scratch/quickshell-v1/issues/15-edge-handles-and-flyouts.md`
- `.scratch/quickshell-v1/issues/05-launcher-overlay.md`
