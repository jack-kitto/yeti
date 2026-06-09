Status: done

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Rebrand the product name from **Quickshell** to **Yeti** across user-visible surfaces and domain docs.

The codebase already ports the "Yeti" reference shell (`72f4dea`); this issue makes the name consistent everywhere users and contributors see it.

Scope (locked grill 2025-06):

- **Yeti** everywhere — UI, code strings, domain docs; zero Quickshell user-facing
- **Library** / **library snapshot** terms unchanged
- Mechanical ids → `yeti`: `package.json`, IndexedDB DB name, snapshot filename, placeholders
- IndexedDB rename: clean break (no migration)
- Repo folder `quickshell-start` may stay until ops rename

## Acceptance criteria

- [x] Human confirms scope (full consistency minus repo folder)
- [x] User-facing strings say "Yeti" not "Quickshell"
- [x] `CONTEXT.md` opens with Yeti as the product name
- [x] No broken imports or build from rename pass
- [x] ADR or CONTEXT note if repo URL / package name stay `quickshell` temporarily

## Blocked by

None for scoping — wide rename is AFK after scope locked

## Comments

Backlog item 2025-06. Repo folder may remain `quickshell-start` until hosting/npm decision.
