Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/issues/32-canvas-center-widgets.md`

## What to build

Fix layout and alignment in the **settings** **Canvas** section (`ShellConfigCanvasWidgets`). Checkbox rows reuse `shell-config-catalog` styles meant for link rows; labels, checkboxes, and row backgrounds are misaligned compared to other settings sections (Links, Workspaces, Edges).

Match existing settings patterns: consistent row height, checkbox + label alignment, spacing with `shell-config-form-label` / `shell-config-dialog-copy`.

## Acceptance criteria

- [ ] Canvas widget toggles align visually with other settings list rows
- [ ] Checkbox and label sit on one baseline; no overlapping or off-center card backgrounds
- [ ] Section reads correctly at default dialog width and when the body scrolls
- [ ] No regression to per-workspace toggle behavior

## Blocked by

None — can start immediately

## Comments

Reported UX bug 2026-06. Canvas section uses catalog item chrome without catalog item structure.
