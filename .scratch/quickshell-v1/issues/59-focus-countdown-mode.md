Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/issues/46-internal-tools-v1-completion.md`

## What to build

Implement **focus countdown** timer mode — single-interval timer on the pomodoro tool record. ADR: `docs/adr/0006-focus-countdown-timer-mode.md`.

Add **Start countdown** on tasks flyout and canvas widget (from task estimate). Starting countdown or pomodoro replaces the other. Persist `mode`, duration, `endsAt`, and active task across reload and snapshot round-trip.

## Acceptance criteria

- [ ] `PomodoroState.mode`: `"pomodoro" | "countdown"`
- [ ] **Start countdown** on task with estimate starts countdown for that many minutes
- [ ] **Start countdown** disabled when task has no estimate
- [ ] Countdown does not advance work/break phases; pomodoro mode unchanged
- [ ] Flyout and canvas widget show mode-appropriate UI
- [ ] Snapshot export/import round-trips countdown fields
- [ ] TDD on domain logic in `pomodoro.ts` / `tasks.ts`

## Blocked by

Issue 55 recommended first (shared timer UX clarity)

## Comments

Grill 2026-06. `CONTEXT.md` → **Focus countdown**.
