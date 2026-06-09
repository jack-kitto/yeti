Status: done

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
- [x] ~~Top dashboard and right config functional beyond placeholder copy~~ — superseded: config shipped via centered dialog (issues 06–09); top/right rim roles re-scoped in issues 27–28; settings entry moves off right rim (issue 26)
- [x] ~~Human sign-off on deformation motion~~ — deferred to issue 12 (motion/visual polish)

## Blocked by

- `.scratch/quickshell-v1/issues/15-edge-handles-and-flyouts.md`

## Comments

**Closed:** Core rim shell is landed (`72f4dea` + search pocket polish + config dialog refactor `a874ba4`). This issue tracked the **Yeti port**, not ongoing top/right product design.

**Superseded scope:**
- Right-rim settings entry — product direction is command bar / left-edge entry (issue 26), not a config pocket on the right.
- Right rim — becomes internal-tools edge (issue 28), not config.
- Top rim — control-center scope in issue 27.

Motion and pocket feel polish remain in issue 12.
