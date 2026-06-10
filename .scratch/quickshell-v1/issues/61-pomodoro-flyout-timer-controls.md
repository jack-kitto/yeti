Status: done

## Parent

`.scratch/quickshell-v1/issues/46-internal-tools-v1-completion.md`

## What to build

Fix pomodoro flyout UX gaps found after issue 55:

- Start/Pause/Reset controls visible without scrolling past custom split form
- Pinned rim **Dismiss** no longer overlaps custom split inputs
- **Clear focus** undoes arming a task; **Reset** clears active task too

## Acceptance criteria

- [x] Primary timer controls sit below status, above scrollable split config
- [x] Internal tool flyout scrolls split config; dismiss sits outside scroll area
- [x] **Clear focus** button when a task is armed
- [x] **Reset** resets timer phase without clearing armed task (**Clear focus** clears `activeTaskId`)
- [x] Tests cover clear focus and reset behavior

## Comments

Ad-hoc fix 2026-06 before issue 56.
