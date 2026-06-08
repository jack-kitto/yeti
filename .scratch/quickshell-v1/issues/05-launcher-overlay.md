Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Build the **launcher** — a full-screen or large overlay for browsing links, distinct from the **command bar**.

Open from "see more" on an edge flyout, pre-filtered to that **edge**'s link group. Default scope is the active workspace; provide a toggle to show the full **link catalog**. Include in-launcher search/filter. Grid layout with link display (icon + title). Clicking a link opens a new tab.

## Acceptance criteria

- [ ] "See more" on an edge flyout opens the launcher filtered to that edge's group
- [ ] Launcher defaults to active workspace links; toggle expands to full catalog
- [ ] In-launcher search/filter narrows visible links
- [ ] Launcher feels like an app launcher (grid, overlay), not a settings page
- [ ] Clicking a launcher link opens a new tab

## Blocked by

- `.scratch/quickshell-v1/issues/02-edge-link-menus.md`
