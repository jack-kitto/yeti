Status: done

## Parent

`.scratch/quickshell-v1/issues/46-internal-tools-v1-completion.md`

## What to build

Make the pomodoro tool flyout intuitive — user should always see whether the timer is **work** vs **break**, and which **focus split** applies.

Show **phase label** (Work / Short break / Long break) and **split summary** (e.g. `25 / 5 / 15`) alongside the countdown. When idle, preview the upcoming interval for the current phase so work vs break is obvious.

## Acceptance criteria

- [x] Running and idle states show current phase name
- [x] Active **focus split** summary visible in flyout
- [x] Idle state previews duration for current phase (not confused with break-only display)
- [x] Existing start/pause/reset/chime/split-picker behavior preserved

## Blocked by

None — may land in parallel with issue 53

## Comments

Grill 2026-06. Addresses "timer shows break time but not work time" confusion.
