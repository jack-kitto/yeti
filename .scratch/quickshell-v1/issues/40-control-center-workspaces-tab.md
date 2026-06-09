Status: done

## Parent

`.scratch/quickshell-v1/issues/27-top-rim-control-center.md`

## What to build

Replace the control center **Workspaces** placeholder with a working tab: list every workspace, highlight the active one, and switch on click. Align the control center tab bar with v1 scope (**Workspaces**, **Calendar**, **Media** — drop Dashboard and Performance).

Each row shows workspace name and an accent swatch from the workspace **theme**. Calendar and Media tabs stay as setup placeholders until issues 41–43.

## Acceptance criteria

- [x] Control center tabs are Workspaces, Calendar, and Media only
- [x] Workspaces tab lists all workspaces with the active one marked
- [x] Clicking a workspace switches the active workspace (same behavior as command bar)
- [x] Active workspace context is visible at a glance (name + theme accent)

## Blocked by

None — can start immediately

## Comments

Tracer bullet 1 of 4 for issue 27.

Shipped in `feat(control-center): add workspaces tab with v1 tab bar`.
