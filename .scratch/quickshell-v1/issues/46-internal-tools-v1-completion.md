Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/issues/28-right-edge-internal-tools.md`

## What to build

Close the gap between issue 28's minimal ship and **CONTEXT.md** for **internal tools** on the **right rim**.

**Pomodoro:** configurable **focus split** — built-in presets up to **50 min work / 10 min break** (and sensible long-break variants), plus a **custom split** the user defines. Split picker in the pomodoro flyout (or settings). Auto-advance phases when the timer ends; optional **chime** toggle (off by default). Show **active focus task** name when set.

**Tasks:** **Start focus** on a task sets it active and starts a work-interval pomodoro. Backlog vs **today** toggle (flyout defaults to today). **Reorder** tasks via **fractional order**. Optional time **estimate** (minutes) on add/edit. Complete from either flyout.

## Acceptance criteria

- [ ] User can select from multiple built-in splits (range includes up to 50/10) and define a custom split
- [ ] Split choice persists per workspace in the **library**
- [ ] Timer advances work → break → work on session end; chime plays when enabled
- [ ] Start focus couples task + pomodoro; timer flyout shows active task name
- [ ] Tasks flyout supports today flag, reorder, and estimates per CONTEXT
- [ ] Snapshot export/import round-trips extended pomodoro/task fields

## Blocked by

None — issue 28 baseline is done

## Comments

Issue 28 shipped start/pause/add/complete only. Domain language: `CONTEXT.md` → **Focus split**, **Focus task**, **Internal tool**.
