Status: ready-for-human

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Design review and polish pass on shell feel — the rice aesthetic.

Refine Framer Motion spring animations for **edge flyouts** (shell deformation from **edge handle** anchor — not centered modals), **launcher** enter/exit, **settings dialog** open/close, and **workspace transition** (issue 11): horizontal canvas-plane scroll; shell expands to screen edges hiding the canvas, workspace swaps, shell contracts to normal rim size. Tune glassmorphism (soft warm palette, off-white surfaces, gentle shadows, large radii, subtle transparency). Verify **notch** sizing and internal scroll feel right at varied content sizes.

This slice requires human review of visual and motion quality before v1 is considered complete.

## Acceptance criteria

- [ ] Edge flyouts deform/emerge from handle anchors with spring physics
- [ ] Launcher and settings dialog transitions match shell motion language
- [ ] Visual design aligns with PRD direction: warm, glass, minimal borders, OS-like
- [ ] Rim **notch** sizing (search, top dashboard stub, right tools) feels correct in practice
- [ ] Human sign-off on shell aesthetic before closing v1

## Blocked by

- `.scratch/quickshell-v1/issues/25-canvas-rim-shell.md` (done — rim behavior stable)

## Comments

Canvas deformation shell (issue 25) is done. Settings UI is a centered dialog, not a right-rim flyout — polish that surface instead of legacy config-panel language.

Top and right rim **notches** may still change shape when issues 27–28 land; avoid over-investing in right-rim config styling (issue 26 removes it).

**Refinement (2026-06):** Rim notch open/close must expand from a point (both `span` and `depth` scaled by `t`), not pop to half-width on frame 1. Close animation must retreat inward (`t` → 0) before rim menu unmount — tracked in `layout.test.ts` / `shell-animation.ts`.

**Layering (2026-06-09):** Stacking and flyout card removal tracked in issue 52 / ADR 0005 — complete before final aesthetic sign-off here.
