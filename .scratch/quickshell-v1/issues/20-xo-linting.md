Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Add **XO** as the linter for TypeScript, React, and Next.js. Configure XO to defer formatting to Prettier (no duplicate style rules). Add `npm run lint` script. Fix or explicitly waive any violations in the existing codebase so lint passes on day one.

## Acceptance criteria

- [ ] `xo` is a dev dependency with project config (`.xo-config.json` or `package.json` field)
- [ ] XO integrates with Prettier (no conflicting formatting rules)
- [ ] `npm run lint` passes on the current tree
- [ ] TypeScript/React/Next paths are included; build output dirs ignored

## Blocked by

- `.scratch/quickshell-v1/issues/19-prettier-formatting.md`
