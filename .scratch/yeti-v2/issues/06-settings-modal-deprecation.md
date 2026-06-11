Status: ready-for-agent

## Parent

`.scratch/yeti-v2/PRD.md`

## What to build

Remove the **settings** modal per ADR 0011 after parity from issue 05 and existing **control center** presets tab:

- Delete `ShellConfigDialog` and section components (or reduce to zero)
- Remove `:settings` action and top-right settings control
- Move any remaining essentials: shortcuts editing → YAML docs or control center; focus radio / ICS → YAML sections in example repo
- Update `CONTEXT.md` **settings** term to past tense or redirect to config surfaces

## Acceptance criteria

- [ ] No settings modal in `/home`; config reachable via command bar, control center, YAML
- [ ] `:reset` and snapshot import/export still reachable
- [ ] README and CONTEXT.md updated
- [ ] No dead imports or config-store sections for removed UI

## Blocked by

- `.scratch/yeti-v2/issues/05-command-bar-config-actions.md`
