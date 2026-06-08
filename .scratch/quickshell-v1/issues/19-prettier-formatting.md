Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Add **Prettier** as the project formatter. Configure defaults suited to this TypeScript/React codebase (semi, single quotes or match existing style, trailing commas). Add `npm run format` and `npm run format:check` scripts. Format the existing codebase in one pass so CI can enforce a clean baseline.

Prettier owns formatting only — lint rules come in issue 20 (XO).

## Acceptance criteria

- [ ] `prettier` and config file are dev dependencies
- [ ] `npm run format` writes formatted files; `npm run format:check` exits non-zero on drift
- [ ] Sensible ignore patterns (e.g. `.next/`, `node_modules/`, lockfiles)
- [ ] Existing source is formatted so the repo starts clean

## Blocked by

None - can start immediately.
