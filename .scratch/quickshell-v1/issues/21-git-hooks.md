Status: done

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Add **git hooks** (Husky + lint-staged) so commits are gated locally: format and lint staged files before commit. Keep hooks fast — staged files only, not the full tree.

## Acceptance criteria

- [x] Husky installs on `npm install` (`prepare` script)
- [x] Pre-commit runs lint-staged: Prettier on staged files, XO on staged TypeScript
- [x] A commit with lint/format violations is blocked locally
- [x] Hooks do not run full test suite (CI owns that)

## Blocked by

- `.scratch/quickshell-v1/issues/19-prettier-formatting.md`
- `.scratch/quickshell-v1/issues/20-xo-linting.md`
