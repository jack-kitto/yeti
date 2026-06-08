Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Implement the right-edge **config panel**. Hover anywhere along the right edge to open. Panel height follows content up to the full edge height; scrolls internally on overflow.

First config section: **link catalog** CRUD. Add, edit, and delete links (URL required; title and image optional). Changes persist to IndexedDB via the Library module. Links can exist in the catalog without any **placement**.

## Acceptance criteria

- [ ] Hovering the right edge opens the config panel flyout
- [ ] Panel auto-sizes to content up to full viewport height; overflows scroll inside the panel
- [ ] User can add a link with URL and optional title/image
- [ ] User can edit and delete existing catalog links
- [ ] Catalog changes persist across page reload
- [ ] Links can exist in catalog without being placed on edges or pins

## Blocked by

- `.scratch/quickshell-v1/issues/01-boot-the-shell.md`
