Status: done

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Extend the **config panel** with workspace and theme management.

**Workspaces:** create, rename, delete workspaces. One workspace active at a time.

**Themes:** per-workspace full theme editing — color palette, background image URL, glass/surface styling (opacity, radii, shadows as defined in theme token model). Changes apply live to the shell when editing the active workspace.

## Acceptance criteria

- [x] User can create, rename, and delete workspaces from config
- [x] User can edit active workspace theme: palette, background image URL, glass/surface styling
- [x] Theme changes apply immediately when editing the currently active workspace
- [x] Switching workspace after edit shows that workspace's saved theme
- [x] Cannot delete the last remaining workspace (or sensible guard exists)

## Blocked by

- `.scratch/quickshell-v1/issues/06-config-link-catalog.md`

## Comments

Implemented via `src/workspace/workspaces.ts` (CRUD + 6 tests), `src/theme/workspace-theme.ts` (theme patch + 3 tests), library/hooks persistence, and `ShellConfigWorkspaces` config section.
