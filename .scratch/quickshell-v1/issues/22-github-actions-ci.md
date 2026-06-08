Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Add a **GitHub Actions** workflow that runs on pull requests and pushes to `main`: install dependencies, run `npm run lint`, `npm run format:check`, `npm test`, and `npm run build`. This is the quality gate before merge and before release.

## Acceptance criteria

- [ ] Workflow file under `.github/workflows/` triggers on `pull_request` and `push` to `main`
- [ ] CI runs lint, format check, tests, and production build
- [ ] Node version is pinned (e.g. via `.nvmrc` or workflow `node-version`)
- [ ] Failed checks block merge when branch protection is enabled

## Blocked by

- `.scratch/quickshell-v1/issues/19-prettier-formatting.md`
- `.scratch/quickshell-v1/issues/20-xo-linting.md`
