Status: ready-for-agent

Category: enhancement

## Parent

`.scratch/quickshell-v1/issues/12-motion-visual-polish.md`

## What to build

Replace the current **workspace transition** seal close/open + palette lerp (issue 65) with a **ripple reveal** using the [View Transitions API](https://magicui.design/docs/components/animated-theme-toggler) — clip-path expands from the switch origin, revealing the full viewport: canvas background, widgets, and **shell** rim/notch colours for the incoming workspace. No seal/breathe.

- Origin: trigger element when switch is click-driven (command bar row, control center workspace row); viewport center when keyboard-only (Tab / shortcut)
- Background URL + shell palette swap inside the reveal — no flash
- **Launcher** and **settings** stay outside the transition (top plane)
- Cross-fade fallback when View Transitions unsupported
- Remove or gut seal morph in `workspace-transition.ts` / `layout.ts`

## Acceptance criteria

- [ ] Work ↔ Personal switch reads as ripple reveal, not seal close/open
- [ ] Ripple origin follows click target; keyboard paths use viewport center
- [ ] Background swap invisible — part of the reveal
- [ ] All switch paths share one transition (command bar, control center, Tab, shortcut)
- [ ] Graceful fallback without View Transitions
- [ ] Human sign-off on motion; issue 12 can close related items
- [ ] Tests updated for new transition timing/shape

## Blocked by

Ripple origin sign-off from grill session (if not yet locked)

## Comments

**Product feedback (2026-06-10):** User dislikes current workspace transition; prefers Magic UI-style ripple from button.

**Grill locked (2026-06-10):** Ripple reveal (option B), not cross-fade. Full viewport scope — canvas + shell colours reveal together; launcher/settings excluded. Supersedes issue 65 seal morph and cancels issue 78.
