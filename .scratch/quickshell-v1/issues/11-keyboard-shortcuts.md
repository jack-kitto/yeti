Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Implement configurable, tab-scoped keyboard shortcuts beyond command bar focus (covered in issue 16).

Support cycling through **workspaces** when the command bar is **empty**: **Tab** / **Shift+Tab** cycles workspaces (locked); when the bar has a query, Tab cycles results instead (issue 31). Optional dedicated chord hotkeys remain configurable in **settings**. Shortcuts only fire when the Yeti tab is focused.

Workspace switches use the **workspace transition** (issue 12): canvas plane scrolls horizontally; shell expands to screen edges (hiding canvas), swaps workspace, contracts back to normal rim size.

## Acceptance criteria

- [ ] Tab / Shift+Tab cycles workspaces when command bar query is empty
- [ ] Tab / Shift+Tab cycles results when command bar has a query (issue 31)
- [ ] Optional dedicated workspace-cycle chord(s) configurable in settings
- [ ] Shortcuts do not fire when focus is in another browser tab
- [ ] User can view and change shortcut bindings in settings
- [ ] Custom bindings persist across reload
- [ ] Command bar focus shortcut does not conflict with common browser shortcuts (see issue 16)

## Blocked by

- `.scratch/quickshell-v1/issues/16-command-bar-keyboard.md`
- `.scratch/quickshell-v1/issues/06-config-link-catalog.md`
