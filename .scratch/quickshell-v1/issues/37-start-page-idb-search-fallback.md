Status: done

## Parent

`.scratch/quickshell-v1/issues/34-ssr-start-page-bootstrap.md`

## What to build

Wire `/start` to IndexedDB and make search functional end-to-end:

- Client reads **library** from IndexedDB (same store as **home station**)
- **Library** exists → fuzzy search over full **link catalog**; apply active **workspace** **theme** as backdrop; `Enter` opens link in new tab
- **Library** absent → show **starter template** defaults for search + theme; display prompt to load config (open `/home` or import **library snapshot** via link to `/home`)
- When IDB resolves after loading state, transition to search-ready without full page reload
- Search-only surface: no **command bar actions**, no workspace switching on `/start`

Reuse existing pure search logic and command bar patterns where possible; do not duplicate catalog merge or URL-encoding logic.

## Acceptance criteria

- [x] User with populated IndexedDB can fuzzy-search and open a link from `/start`
- [x] User with no IndexedDB sees **starter template** catalog and a clear prompt to load their config
- [x] Active **workspace** **theme** applies as backdrop when **library** is present
- [x] Catalog reflects live **library** changes without regenerating any URL
- [x] Type-to-focus behavior on `/home` (issue 31) unaffected

## Blocked by

- `.scratch/quickshell-v1/issues/36-start-page-ssr-shell-loading.md`

## Comments

Tracer bullet 3 of 5 for issue 34.

Shipped in `feat(start-page): wire IndexedDB search with starter fallback`.
