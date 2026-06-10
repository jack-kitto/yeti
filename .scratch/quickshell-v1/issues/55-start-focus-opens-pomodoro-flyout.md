Status: done

## Parent

`.scratch/quickshell-v1/issues/46-internal-tools-v1-completion.md`

## What to build

Change **Start focus** on a **focus task**: set the task active and open/pin the pomodoro tool flyout — do **not** start the timer until the user picks a **focus split** and presses Start in the flyout.

Decouple `startFocusOnTask` from immediate `startPomodoro`. Canvas widget **Start focus** (issue 58) follows the same rule.

## Acceptance criteria

- [x] **Start focus** sets active task without starting timer (`running: false`, no `endsAt`)
- [x] Pomodoro flyout opens (pinned) with active task name visible
- [x] Timer starts only on explicit Start in pomodoro flyout
- [x] Tests updated in `tasks.test.ts` and flyout integration as needed

## Blocked by

None — pairs naturally with issue 54

## Comments

Grill 2026-06. `CONTEXT.md` → **Focus task** → **Start focus**.
