Status: ready-for-human

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Design review and polish pass on shell feel — the rice aesthetic.

Refine Framer Motion spring animations for **edge flyouts** (shell deformation from **edge handle** anchor — not centered modals), **launcher** enter/exit, and **config panel** open. Tune glassmorphism (soft warm palette, off-white surfaces, gentle shadows, large radii, subtle transparency). Verify config panel auto-height and internal scroll feel right at varied content sizes.

This slice requires human review of visual and motion quality before v1 is considered complete.

## Acceptance criteria

- [ ] Edge flyouts deform/emerge from handle anchors with spring physics
- [ ] Launcher and config panel transitions match shell motion language
- [ ] Visual design aligns with PRD direction: warm, glass, minimal borders, OS-like
- [ ] Config panel sizing behavior (content-height → full edge → scroll) feels correct in practice
- [ ] Human sign-off on shell aesthetic before closing v1

## Blocked by

- `.scratch/quickshell-v1/issues/15-edge-handles-and-flyouts.md`
- `.scratch/quickshell-v1/issues/03-canvas-pin-strip.md`
- `.scratch/quickshell-v1/issues/05-launcher-overlay.md`
- `.scratch/quickshell-v1/issues/06-config-link-catalog.md`
