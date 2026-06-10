Status: wontfix

## Parent

`.scratch/quickshell-v1/PRD-preset-themes.md`

## What to build

Extend **workspace transition** colour morph to cover the expanded **theme** token set: shell palette lerp (existing), plus any interpolatable per-widget colour fields during transition. Background URL swap timing at morph midpoint must remain smooth.

Widget zone placement should switch at workspace swap (not mid-lerp) — colours may lerp, layout snaps when the workspace changes underneath the sealed shell.

## Acceptance criteria

- [ ] Workspace switch morphs shell palette across the full transition duration
- [ ] Background URL swaps at the established morph midpoint without flash
- [ ] Per-widget text colours morph or cross-fade without a jarring discrete step (pick smallest correct approach; document in comment)
- [ ] Widget zones/orders update when the workspace swaps, not mid-morph
- [ ] `workspace-transition` tests updated for expanded theme snapshot fields

## Blocked by

- `.scratch/quickshell-v1/issues/72-preset-theme-model.md`
- `.scratch/quickshell-v1/issues/74-shell-surface-rendering.md`

## Comments

Tracer bullet 7 of preset-themes rework. Builds on issue 65 transition work.

**2026-06-10:** Cancelled — issue 84 ripple reveal replaces seal morph; per-widget colour lerp during seal is no longer applicable.
