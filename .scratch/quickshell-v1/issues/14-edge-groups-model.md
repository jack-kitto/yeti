Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Replace flat per-edge link arrays with **edge groups** in the **library** schema. Each **edge group** has: stable id, user-assigned name, handle icon (image URL → emoji/text → name initials), **fractional order** along its **edge**, and an ordered list of catalog link ids (also **fractional order**).

Breaking change — no auto-migration from the old shape. **Library reset** is the upgrade path (issue 17).

Update the **starter template** with multiple named groups per edge (e.g. dev tools + docs on left). Update **Placement** resolvers: resolve links for a group, resolve groups for an edge, resolve workspace placements. Remove or replace old flat-edge APIs.

## Acceptance criteria

- [ ] Library types model edge groups per edge (left, top, bottom) with fractional order
- [ ] Starter template seeds multiple edge groups per edge with names and handle icons
- [ ] Placement module resolves links for a specific edge group and lists groups on an edge
- [ ] Pin strip order uses fractional order keys in the schema
- [ ] Unit tests cover group resolution and ordering
- [ ] Old flat-edge library shape is not supported (reset required)

## Blocked by

- `.scratch/quickshell-v1/issues/13-fractional-order.md`
