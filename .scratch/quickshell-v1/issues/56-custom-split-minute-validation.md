Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/issues/46-internal-tools-v1-completion.md`

## What to build

Remove the 60-minute cap on custom **focus split** work intervals. Validate only positive whole-minute values for work, short break, and long break fields.

## Acceptance criteria

- [ ] Custom split accepts any positive integer minutes (no preset maximum)
- [ ] Invalid values (0, negative, non-integer) rejected in domain logic and UI
- [ ] HTML `max` attributes removed from custom split inputs
- [ ] Tests cover validation edge cases

## Blocked by

None

## Comments

Grill 2026-06. Built-in presets stay curated; custom split is uncapped per `CONTEXT.md`.
