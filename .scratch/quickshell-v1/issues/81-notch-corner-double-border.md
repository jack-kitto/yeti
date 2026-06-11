Status: done

Category: bug

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Fix the visual artefact at the **bottom corners** of left- and right-rim **notches** (not top or bottom rim notches): two overlapping strokes/surfaces — one with pocket corner radius, one square — producing a "double border" look. Most visible on the **editorial** preset (`solid` shell, black border).

Likely cause: frame ring stroke + separate notch fill stroke at the pocket junction where inner boundary curves meet the notch extension path. Renderer: `src/shell-frame/renderer.ts` (`drawFlatSolidShell` strokes both `generateFrameShellPath` and `generateNotchFillPath`).

## Acceptance criteria

- [x] Left and right rim notch open: bottom pocket corners show a single clean border join
- [x] Top and bottom rim notches unchanged (no regression)
- [x] Editorial preset signed off at 1440×900 with a left **edge flyout** open
- [x] Regression test or renderer snapshot if practical

## Blocked by

None

## Comments

**Product feedback (2026-06-10):** Screenshot shows double line at pocket corner where rounded inner boundary meets square edge. See attached QA image in grill session 2026-06-10.

**Shipped 2026-06-11.**
