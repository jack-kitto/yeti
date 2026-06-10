Status: done

## Parent

`.scratch/quickshell-v1/issues/46-internal-tools-v1-completion.md`

## What to build

Refine **tasks** tool flyout layout — title no longer overlaps action buttons; clearer hierarchy and spacing. CSS/structure only; no new features.

**Layout (locked):** task title + estimate on one row; actions (Up/Down/Backlog/Start focus/Done) on a second row. Prefer icon-only action buttons with `aria-label` tooltips where it reduces cramming.

## Acceptance criteria

- [x] Long task titles wrap without overlapping action controls
- [x] Estimate field and title share the main row with sensible spacing
- [x] Action buttons sit on a separate row below the title/estimate line
- [x] Today/backlog toggle, scroll cap (issue 49), and add-task form behavior unchanged
- [x] Tests cover layout contract via `tasks-flyout-layout` module

## Blocked by

None

## Comments

Grill 2026-06. First tracer in issue 46 UX refinement pass.
