Status: done

## Parent

`.scratch/quickshell-v1/issues/46-internal-tools-v1-completion.md`

## What to build

Add **focus tasks** **canvas widget** — today's task list glance with primary actions. Reads `workspace.internalTools.tasks` (no duplicate state).

Per row: **Start focus** (opens pomodoro flyout per issue 55), **Start countdown** (issue 59 — disabled when no estimate), **Done**. No reorder, estimate editing, or backlog toggle on canvas.

## Acceptance criteria

- [x] `CanvasWidgetId` includes `focusTasks`; settings toggle per workspace
- [x] Widget shows today's incomplete **focus tasks** (title + estimate when set)
- [x] Primary actions per row; dense editing stays on **right rim**
- [x] Snapshot export/import round-trips widget toggle
- [x] Styling matches other canvas widgets

## Blocked by

- Issue 55 (**Start focus** behavior)
- Issue 59 (**Start countdown** — wire action when countdown lands)

## Comments

Grill 2026-06. `CONTEXT.md` → **Canvas widget** glance + primary actions.
