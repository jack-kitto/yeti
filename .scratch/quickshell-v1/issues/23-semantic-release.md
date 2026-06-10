Status: done

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Add **semantic-release** to automate versioning from **Conventional Commits**. On push to `main` (after CI passes), generate the next semver, update `package.json` version, create a Git tag, and publish GitHub Release notes from commit messages.

No deployment step in this workflow — Cloudflare Pages deploys `main` from the Cloudflare dashboard (issue 24).

Configure plugins: `@semantic-release/commit-analyzer`, `@semantic-release/release-notes-generator`, `@semantic-release/changelog` (optional `CHANGELOG.md`), `@semantic-release/npm` (version bump only — package is `private`), `@semantic-release/git` (commit version/changelog bump), `@semantic-release/github`.

## Acceptance criteria

- [x] `semantic-release` and required plugins are dev dependencies
- [x] GitHub Actions release workflow runs on `main` after CI succeeds
- [x] Commits like `feat:`, `fix:`, `BREAKING CHANGE:` drive semver bumps
- [x] GitHub Releases are created with generated notes and matching tags
- [x] `GITHUB_TOKEN` or dedicated bot token documented in README/setup notes

## Blocked by

- `.scratch/quickshell-v1/issues/22-github-actions-ci.md`
