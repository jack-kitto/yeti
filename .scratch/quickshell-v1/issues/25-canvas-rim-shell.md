Status: ready-for-human

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Replace the flat edge-zone layout with a **canvas deformation shell** — a rounded viewport panel whose rim morphs into **pockets** when a zone is active. Ported from the Yeti reference shell.

**Shell frame module** (`src/shell-frame/`): canvas renderer, layout math, rim animation loop, pocket depth/span/anchor targets, zone positioning. Left **edge groups** keep handle + flyout behavior but open inside the deformation model.

**Builtin rim surfaces** (placeholders OK for v1 stubs):
- **Top** — control-center dashboard (`ShellDashboard`, tab placeholders)
- **Bottom** — command bar in a search pocket (`CommandBar` variant `pocket`)
- **Right** — config panel stub (`ShellConfigPanel`, links forward to issue 06)

Measure menu content with `offsetWidth`/`offsetHeight` (not `getBoundingClientRect`) so per-frame scale transforms do not retrigger `ResizeObserver` loops.

## Acceptance criteria

- [x] Central canvas panel renders with animated rim deformation on zone hover/activate
- [x] Left edge group handles and flyouts work inside the pocket model (hover, pin, drag-reorder)
- [x] Bottom rim opens search pocket with command bar (keyboard nav, workspace switch, `:reset`)
- [x] Search results list capped (max height + scroll); pocket resizes with query changes
- [ ] Top dashboard and right config are functional beyond placeholder copy (see issues 06, 08)
- [ ] Human sign-off on deformation motion, pocket sizing, and rim hit-target feel

## Blocked by

- `.scratch/quickshell-v1/issues/15-edge-handles-and-flyouts.md`

## Comments

Partial landing in `72f4dea` (feat(shell): port Yeti canvas shell with pocket-gated flyouts). Search pocket sizing and width polish landed in a follow-up session (uncommitted at review time). Issue 12 (motion/visual polish) overlaps — close 25 when rim shell behavior is signed off, then finish aesthetic pass in 12.
