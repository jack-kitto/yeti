Status: done

## Parent

`.scratch/quickshell-v1/issues/28-right-edge-internal-tools.md`

## What to build

Cap the **tasks** flyout list height so many **focus tasks** scroll inside the flyout instead of growing off-screen. The add-task form stays visible; the task list scrolls above it.

## Acceptance criteria

- [x] Tasks flyout has a max height bounded by viewport / pocket size
- [x] Long task lists scroll internally; flyout does not extend past the visible shell
- [x] Add-task input and actions remain reachable without scrolling the whole page
- [x] Pinned flyout behavior unchanged

## Blocked by

None — can start immediately

## Comments

Reported UX bug 2026-06. `.shell-tool-task-list` currently has no max-height or overflow.
