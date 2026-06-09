Status: wontfix

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Add the **pin strip** to the **canvas** — a horizontal row below the command bar placeholder.

Resolve **pins** from the active workspace **placements**. New pins land in the strip by default. Enforce one **pin** per link per workspace. Use **Link display** for favicon/icon rendering. Clicking a pin opens the link in a new tab.

## Acceptance criteria

- [x] Pin strip renders on canvas with links pinned in the active workspace
- [x] Pins use link display fallbacks (custom image → favicon)
- [x] Clicking a pin opens a new tab
- [x] Only one pin per link per workspace is possible
- [x] Pin order reflects workspace placement data from the library

## Comments

**Superseded (grill 2025-06):** Canvas pins and pin strip **removed** from product model. Links surface via edge groups, command bar, and launcher. Remove pin strip UI and pin placements during issue 32 / canvas refactor. See `CONTEXT.md`.

## Blocked by

- `.scratch/quickshell-v1/issues/01-boot-the-shell.md`
