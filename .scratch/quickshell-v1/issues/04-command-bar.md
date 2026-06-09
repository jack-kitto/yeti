Status: done

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Add the **command bar** to the **canvas** — a compact search input separate from the **launcher**.

Implement the **Search** module: fuzzy match over links with workspace-first ranking (placed links in active workspace first), then full **link catalog** fallback. Results indicate whether a match is placed in the active workspace or catalog-only.

Selecting a result opens the link in a new tab. Support workspace switching via command bar (type workspace name or dedicated switch action — Raycast-style).

Add Search module unit tests.

## Acceptance criteria

- [x] Command bar visible on canvas; typing filters links with fuzzy matching
- [x] Placed links in active workspace rank above unplaced catalog links
- [x] Unplaced catalog links still appear as fallback results
- [x] Selecting a link result opens a new tab
- [x] User can switch workspace from the command bar by name
- [x] Search module unit tests cover ranking and fuzzy match behavior

## Blocked by

- `.scratch/quickshell-v1/issues/01-boot-the-shell.md`

## Comments

Behavior complete. UI moved from canvas input to bottom-rim search pocket (issue 25); canvas variant remains in `CommandBar` for tests but is not mounted in the live shell.

Keyboard navigation may change per issue 31 (remove j/k from results; type-to-focus).
