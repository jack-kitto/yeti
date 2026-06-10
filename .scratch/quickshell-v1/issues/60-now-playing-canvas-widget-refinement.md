Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/issues/46-internal-tools-v1-completion.md`

## What to build

Refine **now playing** **canvas widget**: play/pause controls on canvas; widget persists while paused until user dismisses.

Dismiss sets a per-workspace flag in the **library** (separate from settings on/off toggle). Next **play** from anywhere clears dismiss and shows the widget again.

## Acceptance criteria

- [ ] Widget visible when enabled and station selected, including while paused (unless dismissed)
- [ ] Play/pause controls on canvas widget
- [ ] Dismiss control hides widget until next play
- [ ] Dismiss flag persists in library and snapshot round-trip
- [ ] Settings master toggle still disables widget type
- [ ] TDD on visibility rules

## Blocked by

None — independent slice

## Comments

Grill 2026-06. `CONTEXT.md` → **Canvas widget** now playing dismiss semantics.
