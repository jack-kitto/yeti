Status: ready-for-agent

## Parent

`.scratch/yeti-v2/PRD.md`

## What to build

Minimal Chrome + Firefox extension per ADR 0010:

- Override new tab to user-configured Yeti origin `/start` (default production URL, configurable in extension options)
- After new tab load, focus **command bar** input when the browser allows
- Onboarding page: install steps, link to example config repo, pin `/home` reminder

Package as `yeti-extension/` in monorepo or separate repo; document sideload vs store publish.

## Acceptance criteria

- [ ] Chrome manifest v3: new tab opens Yeti `/start`
- [ ] Firefox build with equivalent new-tab override
- [ ] Focus behaviour tested on Chrome and Firefox (document failures)
- [ ] Extension does not read or transmit **library** data
- [ ] README section: extension optional, web app works without it

## Blocked by

None — can start immediately
