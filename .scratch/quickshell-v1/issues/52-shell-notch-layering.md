Status: in-progress

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Fix shell vs **rim menu** vs **canvas** stacking per ADR `docs/adr/0005-shell-notch-layering.md` and `CONTEXT.md` (**notch** terminology).

- **Canvas** plane (widgets + theme) at the bottom
- **Shell** canvas + **edge handles** above canvas
- **Rim menu** content above shell/notch — no flyout wrapper card/backdrop
- **Edge flyouts**: bare link rows on the notch; denser menus keep item-level row chrome only
- **Launcher** / **settings** unchanged on top plane

## Acceptance criteria

- [ ] Open any rim notch (top control center, left edge group, right tool, bottom command bar) — menu content paints **above** the canvas-drawn shell frame
- [ ] Canvas widgets occluded only where the notch overlaps (e.g. clock under top notch); visible elsewhere
- [ ] No glass card/backdrop on `.shell-surface.visible` / `.shell-flyout.visible`
- [ ] Edge link flyouts are visually bare on the notch (no row hover panels)
- [ ] `npm test -- --run` passes

## Blocked by

- None (domain decisions locked in grill session 2026-06-09)

## Comments

**Grill outcomes (2026-06-09):** Replaces inward “pocket under canvas” language from issue 25. See ADR 0005. Issue 12 polish should use **notch** sizing language going forward.

**Implementation (2026-06-09):** DOM stack `canvas z-1` → `ShellCanvas z-10` → `shell-edge-chrome z-15` (handles, rim hits) → `shell-rim-menu-layer z-20` (surfaces). Removed flyout card from `.shell-surface.visible`. Edge link hovers bare.

**Contrast pass (2026-06-09):** Shell rim + notch use theme `surface` at high opacity (`glassOpacity`-scaled). Canvas draws an opaque notch fill in the pocket cutout; rim menus get a light frosted backdrop (blur, no card chrome). Needs visual sign-off on `/home`.
