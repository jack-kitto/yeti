Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Implement configurable, tab-scoped keyboard shortcuts.

Default bindings avoid browser conflicts (e.g. `⌘⇧K` to focus **command bar**). Support cycling through **workspaces** via hotkey. Shortcuts only fire when the Quickshell tab is focused. User can rebind shortcuts in the **config panel**; bindings persist in the library.

## Acceptance criteria

- [ ] Default shortcut focuses the command bar without conflicting with common browser shortcuts
- [ ] Hotkey cycles to next/previous workspace
- [ ] Shortcuts do not fire when focus is in another browser tab
- [ ] User can view and change shortcut bindings in config
- [ ] Custom bindings persist across reload

## Blocked by

- `.scratch/quickshell-v1/issues/04-command-bar.md`
