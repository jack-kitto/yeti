Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/issues/46-internal-tools-v1-completion.md`

## What to build

Add **pomodoro** **canvas widget** — per-workspace settings toggle, snapshot round-trip, render in canvas stack. Reads `workspace.internalTools.pomodoro` (no duplicate state).

**Slice 1:** timer display + phase/split glance + start/pause primary actions.  
**Slice 2:** hourglass/particle animation synced to active timer (prototype variants OK before commit).

## Acceptance criteria

- [ ] `CanvasWidgetId` includes `pomodoro`; settings toggle per workspace
- [ ] Widget shows phase, time remaining, active task name, split summary
- [ ] Start/pause controls on canvas; dense config stays on **right rim**
- [ ] Snapshot export/import round-trips widget toggle
- [ ] Slice 2: visual progress indicator (hourglass/particles) tracks `endsAt` countdown
- [ ] Styling/animation quality matches clock/quote/nowPlaying widgets

## Blocked by

Issue 54 recommended before slice 1 (phase/split display language)

## Comments

Grill 2026-06. Two vertical commits in one issue per user decision.
