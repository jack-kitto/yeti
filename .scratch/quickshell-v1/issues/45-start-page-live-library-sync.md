Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/issues/34-ssr-start-page-bootstrap.md`

## What to build

When the **library** changes in a pinned **home station** tab (add/edit links, workspace switch, theme change, etc.), open **start page** tabs should reflect those changes without a full reload.

Today `useStartPageLibrary` reads IndexedDB once on mount; edits in `/home` do not update an open `/start` tab until reload. Wire the start page to the same React Query `["library"]` cache as `useLibrary`, or subscribe to IDB writes via `storage` / `BroadcastChannel` across tabs.

## Acceptance criteria

- [ ] Editing the library in `/home` updates an already-open `/start` tab's search catalog within one interaction cycle
- [ ] Active workspace **theme** on `/start` backdrop updates when the active workspace or its theme changes elsewhere
- [ ] No regression to starter-template fallback when no library exists
- [ ] Behavior covered by tests through public hooks or resolver modules

## Blocked by

None — can start immediately

## Comments

Gap called out in issue 34 retrospective (2026-06). ADR 0004 allows local IDB as shared source of truth across surfaces on the same origin.
