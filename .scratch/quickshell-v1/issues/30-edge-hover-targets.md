Status: done

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Fix edge **handle** and **flyout** hover usability. Today the pointer must stay on a small hit target; moving slightly outside closes the flyout before the user can reach menu content.

Expand effective hover zones so moving from handle → flyout → bridge feels continuous (locked approach):

- Larger hit area around each **edge handle** (~40px minimum effective target)
- Reliable **hover bridge** between handle and flyout
- **Stacked rim zones** — the rim segment is divided into per-handle hover traps (stacked along the edge); each zone keeps its flyout open while the pointer traverses handle → bridge → menu. Entire rim is active hover territory, but scoped per handle — not one undifferentiated corridor

Relevant code: `shell-edge-layer.tsx`, `shell-zones.ts`, `shell-hover-bridge` / rim hit CSS in `globals.css`.

## Acceptance criteria

- [x] User can move pointer from handle to flyout without the menu closing on typical paths
- [x] Hit slop around handles meets ~40px minimum effective target (see interface polish guidelines)
- [x] Pinned flyouts still dismiss only on explicit dismiss, not accidental edge exit
- [x] No regression to drag-reorder on left edge handles

## Blocked by

None — can start immediately

## Comments

Usability fix reported 2025-06. Distinct from issue 12 (motion/aesthetic polish) — this is functional hit-target geometry.
