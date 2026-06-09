Status: done

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Implement the right-edge **config panel**. Hover anywhere along the right edge to open. Panel height follows content up to the full edge height; scrolls internally on overflow.

First config section: **link catalog** CRUD. Add, edit, and delete links (URL required; title and image optional). Changes persist to IndexedDB via the Library module. Links can exist in the catalog without any **placement**.

Include **library reset** — "Reset to starter template" with confirmation (same behavior as `:reset` in issue 17).

## Acceptance criteria

- [x] Hovering the right edge opens the config panel flyout
- [x] Panel auto-sizes to content up to full viewport height; overflows scroll inside the panel
- [x] User can add a link with URL and optional title/image
- [x] User can edit and delete existing catalog links
- [x] Catalog changes persist across page reload
- [x] Links can exist in catalog without being placed on edges or pins
- [x] Config exposes library reset with confirmation; re-seeds starter template

## Blocked by

- `.scratch/quickshell-v1/issues/17-command-bar-actions-and-reset.md`

## Comments

Issue 01 is done. Right-rim **config** surface opens via the canvas shell (issue 25) but `ShellConfigPanel` is still a placeholder stub — this issue replaces it with real catalog CRUD.

Implemented via `src/library/catalog.ts` (pure mutations + tests), store wrappers, React Query hooks, and `ShellConfigPanel` catalog UI.

**Entry point evolving (issue 26):** Catalog and all config sections now live in a centered settings dialog opened from the right-rim compact menu. Product direction removes right-rim settings entirely — command bar `:settings` + left-edge control. Functionality here is done; only the chrome entry moves.
