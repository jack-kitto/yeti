Status: done

## Parent

`.scratch/quickshell-v1/issues/34-ssr-start-page-bootstrap.md`

## What to build

Add **start page URL** guidance to **settings**:

- Show the fixed bookmark path `/start` with a copy-to-clipboard control
- Brief helper text: open **home station** once to seed the **library**; pin `/home` for the full **shell**
- No URL generator, no theme picker, no link selection UI

## Acceptance criteria

- [x] Settings exposes `/start` with working copy-to-clipboard
- [x] Helper text explains home-station-first seeding flow
- [x] No encoded-path or theme-slug generation UI

## Blocked by

- `.scratch/quickshell-v1/issues/35-route-split-landing-home-start.md`

## Comments

Tracer bullet 4 of 5 for issue 34. Can ship in parallel with issues 36–37 once routes exist.

Shipped in `feat(settings): add start page URL copy in library section`.
