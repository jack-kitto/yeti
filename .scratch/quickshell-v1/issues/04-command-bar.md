Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Add the **command bar** to the **canvas** — a compact search input separate from the **launcher**.

Implement the **Search** module: fuzzy match over links with workspace-first ranking (placed links in active workspace first), then full **link catalog** fallback. Results indicate whether a match is placed in the active workspace or catalog-only.

Selecting a result opens the link in a new tab. Support workspace switching via command bar (type workspace name or dedicated switch action — Raycast-style).

Add Search module unit tests.

## Acceptance criteria

- [ ] Command bar visible on canvas; typing filters links with fuzzy matching
- [ ] Placed links in active workspace rank above unplaced catalog links
- [ ] Unplaced catalog links still appear as fallback results
- [ ] Selecting a link result opens a new tab
- [ ] User can switch workspace from the command bar by name
- [ ] Search module unit tests cover ranking and fuzzy match behavior

## Blocked by

- `.scratch/quickshell-v1/issues/01-boot-the-shell.md`
