Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Implement configurable, tab-scoped keyboard shortcuts beyond command bar focus (covered in issue 16).

Support cycling through **workspaces** via hotkey. Shortcuts only fire when the Quickshell tab is focused. User can rebind shortcuts in the **config panel**; bindings persist in the library.

## Acceptance criteria

- [ ] Hotkey cycles to next/previous workspace
- [ ] Shortcuts do not fire when focus is in another browser tab
- [ ] User can view and change shortcut bindings in config
- [ ] Custom bindings persist across reload
- [ ] Command bar focus shortcut does not conflict with common browser shortcuts (see issue 16)

## Blocked by

- `.scratch/quickshell-v1/issues/16-command-bar-keyboard.md`
- `.scratch/quickshell-v1/issues/06-config-link-catalog.md`
