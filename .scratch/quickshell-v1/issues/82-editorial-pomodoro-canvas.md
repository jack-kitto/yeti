Status: ready-for-agent

Category: bug

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

When the **editorial** **theme preset** is active and the user starts a **pomodoro** or **focus countdown** timer, the wall **clock** hides (correct — `buildCanvasZoneLayout` swaps clock → pomodoro in `center`) but nothing renders in its place because `EditorialCanvasStack` never mounts `CanvasPomodoroWidget`.

## Acceptance criteria

- [ ] Editorial preset + running timer: countdown in bottom-left (replaces `CanvasClockTimeWidget`), phase label in bottom-right (replaces `CanvasClockDateHeroWidget`) — editorial typography
- [ ] Timer stopped: clock returns in editorial split layout (time BL, date hero BR)
- [ ] Default (non-editorial) preset behaviour unchanged
- [ ] Test covers editorial layout when `pomodoro.running`

## Blocked by

None

## Comments

**Root cause:** `editorial-canvas-stack.tsx` hardcodes clock/quote/welcome/etc. corners but omits pomodoro. `zone-layout.ts` already puts `pomodoro` in `center` when timer active.

**Product feedback (2026-06-10):** Starting pomo/timer on editorial theme leaves canvas clock area empty.

**Grill locked (2026-06-10):** In-place replacement (option B) — timer digits BL, phase label BR; four-corner composition preserved. Do not use viewport center.
