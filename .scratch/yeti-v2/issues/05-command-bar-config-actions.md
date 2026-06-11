Status: ready-for-agent

## Parent

`.scratch/yeti-v2/PRD.md`

## What to build

Extend **command bar** **command bar actions** (ADR 0011) beyond `:settings` and `:reset`:

- `:add` / `:link` — prompt flow or URL paste to add a **link** to the **link catalog** (optional place in active workspace **edge group**)
- `:task` — quick-add **focus task** title (optional estimate)
- `:import` — paste snapshot URL → import **library snapshot**
- `:export` — download v2 snapshot

Home station only for destructive or dense flows; confirm before replace on `:import`.

## Acceptance criteria

- [ ] Actions discoverable via `:` prefix fuzzy match
- [ ] `:add` creates a catalog link visible in search and launcher
- [ ] `:task` appends to active workspace task list
- [ ] `:import` / `:export` work without opening **settings**
- [ ] Tests cover action registration and primary side effects via library module

## Blocked by

- `.scratch/yeti-v2/issues/02-snapshot-v2-export.md` (for `:export` v2 shape)
