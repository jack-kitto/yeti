Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Add the **pin strip** to the **canvas** — a horizontal row below the command bar placeholder.

Resolve **pins** from the active workspace **placements**. New pins land in the strip by default. Enforce one **pin** per link per workspace. Use **Link display** for favicon/icon rendering. Clicking a pin opens the link in a new tab.

## Acceptance criteria

- [ ] Pin strip renders on canvas with links pinned in the active workspace
- [ ] Pins use link display fallbacks (custom image → favicon)
- [ ] Clicking a pin opens a new tab
- [ ] Only one pin per link per workspace is possible
- [ ] Pin order reflects workspace placement data from the library

## Blocked by

- `.scratch/quickshell-v1/issues/01-boot-the-shell.md`
