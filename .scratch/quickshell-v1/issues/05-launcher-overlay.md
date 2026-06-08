Status: done

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Build the **launcher** — a full-screen or large overlay for browsing links, distinct from the **command bar**.

Open from "see more" on an edge flyout, pre-filtered to that **edge**'s link group. Default scope is the active workspace; provide a toggle to show the full **link catalog**. Include in-launcher search/filter. Grid layout with link display (icon + title). Clicking a link opens a new tab.

## Acceptance criteria

- [x] "See more" on an edge flyout opens the launcher filtered to that edge's group
- [x] Launcher defaults to active workspace links; toggle expands to full catalog
- [x] In-launcher search/filter narrows visible links
- [x] Launcher feels like an app launcher (grid, overlay), not a settings page
- [x] Clicking a launcher link opens a new tab

## Blocked by

- `.scratch/quickshell-v1/issues/02-edge-link-menus.md`

## Comments

Initial slice done. Issue 18 updates launcher scope from edge position → **edge group** after issue 15 lands.
