Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Make the **command bar** fully keyboard-operable. Default mode: single flat results list (workspace switches first, then links). `↑`/`↓` and `j`/`k` move highlight; `Enter` opens link or switches workspace; `Esc` clears query or blurs. Visible selection state on the active row. No preview pane.

Wire default `⌘⇧K` (or library shortcut binding) to focus the command bar input when the tab is focused.

## Acceptance criteria

- [ ] Arrow keys and `j`/`k` cycle selection through command bar results
- [ ] `Enter` executes the highlighted row (open link or switch workspace)
- [ ] `Esc` clears or dismisses results
- [ ] Selection highlight is visible; first result selected when results appear
- [ ] Default shortcut focuses command bar without browser conflict

## Blocked by

- `.scratch/quickshell-v1/issues/04-command-bar.md`
