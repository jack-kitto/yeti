Status: done

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Add **command bar action** mode: `:` prefix matches shell actions only (not links). First action: **library reset** (`:reset`) — wipes IndexedDB and re-seeds **starter template** after confirmation.

Implement `resetLibrary(store)` in the Library module. Destructive actions always confirm before executing.

## Acceptance criteria

- [x] Typing `:` switches command bar to action mode; only actions appear in results
- [x] `:reset` surfaces "Reset to starter template"; `Enter` shows confirmation dialog
- [x] Confirmed reset wipes library and re-seeds; shell reflects new data without DevTools
- [x] Cancelled reset leaves library unchanged
- [x] Library module test covers reset behavior

## Blocked by

- `.scratch/quickshell-v1/issues/16-command-bar-keyboard.md`
- `.scratch/quickshell-v1/issues/14-edge-groups-model.md`
