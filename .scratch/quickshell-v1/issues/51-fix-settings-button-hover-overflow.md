Status: done

## Parent

`.scratch/quickshell-v1/issues/26-relocate-settings-entry.md`

## What to build

Fix the top-right **settings** ghost handle (`ShellSettingsButton`) so hover/focus background and motion do not overflow its container or bleed into the canvas.

The ghost variant applies `background: color-mix(...)` and `translateY(-1px)` on hover; on the narrow top-right anchor this reads as a box spilling outside the intended hit area.

## Acceptance criteria

- [x] Settings button hover/active state stays within optical bounds of the handle
- [x] No visible background rectangle overflowing into the canvas or past the top rim
- [x] Hover/focus remains discoverable (contrast or subtle ring acceptable)
- [x] Other ghost handles (right-rim tools) unaffected unless they share the same bug

## Blocked by

None — can start immediately

## Comments

Reported UX bug 2026-06. See `.shell-icon-btn-ghost:hover` in `globals.css` and `.shell-settings-btn` positioning in `shell-settings-button.tsx`.
