Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Add freeform **pin** placement on the **canvas**.

Pins default to the **pin strip**. Drag a pin off the strip to a freeform `{x, y}` position on the canvas. Drag a freeform pin back to the strip to re-dock. One pin per link per workspace. Positions persist per workspace in the **library**.

## Acceptance criteria

- [ ] User can drag a pin from the strip to a freeform canvas position
- [ ] User can drag a freeform pin back to the strip to re-dock
- [ ] Freeform positions persist across page reload
- [ ] Pin positions are stored per workspace (Work and Personal can differ)
- [ ] Still only one pin per link per workspace

## Blocked by

- `.scratch/quickshell-v1/issues/03-canvas-pin-strip.md`
