Status: done

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Move **settings** entry off the right rim. The settings **dialog** (issues 06–09) stays; only the entry point changes.

**Remove:** right-rim hover pocket with `ShellConfigMenu` (`BUILTIN_SURFACE.RIGHT_CONFIG` as settings).

**Add (both):**
1. **Command bar action** — e.g. `:settings` opens the existing settings dialog (default section or last-used).
2. **Left-edge affordance** — a settings control at the bottom of the left rim (below edge group handles), opening the same dialog.

Right rim hit zone can remain temporarily empty/stubbed until issue 28 repurposes it.

## Acceptance criteria

- [x] Hovering the right edge no longer opens settings
- [x] `:settings` in the command bar opens the settings dialog
- [x] A control on the left edge (bottom) opens the same dialog
- [x] All existing settings sections (links, edges, pins, workspaces, library) still work
- [x] No regression to command bar search / workspace switch / `:reset`

## Blocked by

None — can start immediately

## Comments

Product decision (2025-06): settings are configuration, not a rim surface. Right rim is reserved for internal tools (issue 28). PRD stories 32–34 (hover right for config) are obsolete once this ships — update PRD/CONTEXT in the same pass or a follow-up docs issue.
