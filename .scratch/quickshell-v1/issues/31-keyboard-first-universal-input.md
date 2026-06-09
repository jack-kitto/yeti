Status: done

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Keyboard-first improvements for the universal search input (bottom-rim **command bar** pocket).

1. **Type-to-focus** (locked) — when the Yeti tab is focused and the user types printable characters (no modifier), focus the command bar and insert that character — unless focus is already in a text field (settings, tool flyouts, etc.).
2. **Remove `j` / `k` from result navigation** — issue 16 shipped `j`/`k` alongside arrows; revert for results list. Users need to type `j` and `k` in queries (e.g. "jdk", "webpack"). Keep **`↑`/`↓`**, **`Tab`/`Shift+Tab`** for cycling selection only.

Preserve existing: `Enter` execute, `Esc` clear/dismiss, `:` action mode, workspace switch rows.

## Acceptance criteria

- [x] Typing a printable key (with no conflicting focus in an input) opens/focuses command bar and appends to query
- [x] `j` and `k` insert into the search field; they do not move selection
- [x] `↑`/`↓` and `Tab`/`Shift+Tab` move highlight through results
- [x] `⌘⇧K` (or configured binding) still focuses command bar explicitly
- [x] Unit or integration test covers navigation key behavior where practical

## Blocked by

None — can start immediately

## Comments

Supersedes part of issue 16 acceptance ("Arrow keys and j/k cycle selection"). Update `CONTEXT.md` command bar terms when shipped.

Related: issue 11 (workspace cycle shortcuts) — separate from result-list keys.
