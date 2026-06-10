Status: done

## Parent

`.scratch/quickshell-v1/issues/46-internal-tools-v1-completion.md`

## What to build

Remove the 60-minute cap on custom **focus split** work intervals. Validate only positive whole-minute values for work, short break, and long break fields.

## Acceptance criteria

- [x] Custom split accepts any positive integer minutes (no preset maximum)
- [x] Invalid values (0, negative, non-integer) rejected in domain logic and UI
- [x] HTML `max` attributes removed from custom split inputs
- [x] Tests cover validation edge cases

## Blocked by

None

## Comments

Grill 2026-06. Built-in presets stay curated; custom split is uncapped per `CONTEXT.md`.
