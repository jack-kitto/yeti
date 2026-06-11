Status: ready-for-human

## Parent

`.scratch/yeti-v2/PRD.md`

## What to build

Document and implement the non-extension **start page** strategy (ADR 0010 fallback):

- README + start page footer: omnibox focus limitation; extension link; pin `/home` for full **command bar** type-to-focus
- Decide whether `/start` gains mouse-first UI (large recent links, click-to-search) or stays minimal until extension ships
- If mouse-first: lightweight link grid or “click to focus search” affordance — no full **shell** bundle

## Acceptance criteria

- [ ] README **Quick start** explains Ctrl+T focus limitation honestly
- [ ] Product decision recorded in issue comments: mouse-first redesign yes/no
- [ ] If yes: `/start` ships click-to-focus or browse UI without regressing IDB search path
- [ ] If no: start page copy points users to extension or `/home`

## Blocked by

None — can start immediately
