Status: done

## Parent

`.scratch/quickshell-v1/issues/28-right-edge-internal-tools.md`

## What to build

Close the gap between issue 28's minimal ship and **CONTEXT.md** for **internal tools** on the **right rim**.

**Pomodoro:** configurable **focus split** — built-in presets up to **50 min work / 10 min break** (and sensible long-break variants), plus a **custom split** the user defines. Split picker in the pomodoro flyout (or settings). Auto-advance phases when the timer ends; optional **chime** toggle (off by default). Show **active focus task** name when set.

**Tasks:** **Start focus** on a task sets it active and starts a work-interval pomodoro. Backlog vs **today** toggle (flyout defaults to today). **Reorder** tasks via **fractional order**. Optional time **estimate** (minutes) on add/edit. Complete from either flyout.

## Acceptance criteria

- [x] User can select from multiple built-in splits (range includes up to 50/10) and define a custom split
- [x] Split choice persists per workspace in the **library**
- [x] Timer advances work → break → work on session end; chime plays when enabled
- [x] Start focus couples task + pomodoro; timer flyout shows active task name
- [x] Tasks flyout supports today flag, reorder, and estimates per CONTEXT
- [x] Snapshot export/import round-trips extended pomodoro/task fields
- [x] UX refinement complete (child issues **53–60**)

## Child issues (UX refinement — grill 2026-06)

| Issue | Scope                                             |
| ----- | ------------------------------------------------- |
| 53    | Tasks flyout layout polish                        |
| 54    | Pomodoro flyout clarity (phase + split)           |
| 55    | Start focus opens pomodoro flyout (no auto-start) |
| 56    | Custom split uncapped positive minutes            |
| 57    | Canvas pomodoro widget (+ hourglass animation)    |
| 58    | Canvas focus tasks widget                         |
| 59    | Focus countdown mode                              |
| 60    | Now playing canvas widget refinement              |

## Blocked by

None — issue 28 baseline is done

## Comments

Issue 28 shipped start/pause/add/complete only. Domain language: `CONTEXT.md` → **Focus split**, **Focus task**, **Internal tool**.

**Functional baseline shipped 2026-06** (`2625c9d`–`5034ee0`, 187 tests). UX not done — umbrella stays open until child issues 53–60 close. Grill decisions captured in `CONTEXT.md` and `docs/adr/0006-focus-countdown-timer-mode.md`.
