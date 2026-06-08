Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Implement the **fractional order** deep module — generate, compare, and insert keys between neighbors. Used by edge group order, link order within groups, pin strip order, and any other user-ordered placement.

See `docs/adr/0002-fractional-order-for-placements.md`. Add unit tests for insert-between, sort-by-key, and rebalance-when-exhausted (if needed).

## Acceptance criteria

- [ ] Module exposes a small public API for creating initial keys, inserting between two keys, and sorting items by key
- [ ] Unit tests cover insert-between and stable sort behavior
- [ ] ADR-0002 is accepted and referenced from module docs or CONTEXT.md terms

## Blocked by

- `.scratch/quickshell-v1/issues/01-boot-the-shell.md`
