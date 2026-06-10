# Yeti

A developer-focused browser shell — spatial navigation, edge-attached panels, and a central workspace canvas. Local-first, no browser extension.

**Home station** (`/home`) is the full shell: pin it and work from it all day. **Start page** (`/start`) is a lightweight new-tab surface for instant search-and-launch. Both read the same **library** from IndexedDB in your browser.

## Features

- **Spatial shell** — glass rim frame with notch-expanding edge menus, not a sidebar dashboard
- **Workspaces** — separate themes and link placements per context (e.g. Work, Personal); shared link catalog
- **Command bar** — keyboard-first fuzzy search for links and workspace switching
- **Edge groups** — named link clusters on the left rim; control center (top), command bar (bottom), internal tools (right)
- **Launcher** — OS-style overlay for browsing a large link catalog
- **Internal tools** — pomodoro timer and focus tasks on the right rim
- **Canvas widgets** — clock, welcome message, and quote per workspace
- **Library snapshots** — export and import your entire setup as versioned YAML (dotfiles-friendly)
- **Offline-ready** — all data in IndexedDB; works on localhost or a hosted URL

## Quick start

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then:

1. **Open home station** — visit `/home` once to seed the starter template into IndexedDB
2. **Pin home station** — keep `/home` open as a pinned tab for the full shell experience
3. **Bookmark start page** — set `/start` as your browser new-tab URL for fast search-and-launch

## Routes

| Route    | Surface                              |
| -------- | ------------------------------------ |
| `/`      | Landing page                         |
| `/home`  | Home station — full shell            |
| `/start` | Start page — command bar search only |

Open `/home` before relying on `/start`. The start page reads the library from IndexedDB; if none exists yet, it shows starter defaults and prompts you to open home station or import a snapshot.

## Keyboard shortcuts

Default bindings (tab-scoped — active only when a Yeti tab is focused):

| Action            | Default                      |
| ----------------- | ---------------------------- |
| Focus command bar | `⌘⇧K` (Mac) / `Ctrl+Shift+K` |
| Cycle workspace   | `Ctrl+Tab`                   |

**Type-to-focus:** printable keys open the command bar and insert the character when focus is not already in a text field.

**Command bar:** fuzzy-match links and workspaces in default mode; prefix `:` for shell actions (e.g. `:settings`, `:reset`). `↑`/`↓` or `Tab`/`Shift+Tab` to move selection; `Enter` to execute; `Esc` to clear or dismiss.

Shortcuts are configurable in settings.

## Library & portability

Your **library** — workspaces, link catalog, placements, themes, shortcuts, and tool state — lives in IndexedDB under the name `yeti`.

- **Export** — settings → export snapshot (`yeti-snapshot.yaml`)
- **Import** — load a snapshot from URL (e.g. a raw file in a GitHub dotfiles repo)
- **Reset** — `:reset` or settings; re-seeds the starter template (requires confirmation)

Snapshots reference theme background images by URL, not embedded bytes. Import replaces the local library; there is no live sync in v1.

## Development

```bash
npm run dev          # Next.js dev server
npm run build        # production build
npm run start        # serve production build
npm test             # run tests (Vitest)
npm run test:watch   # watch mode
```

### Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion · Zustand · TanStack Query · IndexedDB (`idb`)

### Project layout

```
src/
  app/           # routes (/ , /home , /start)
  library/       # domain model + IndexedDB persistence
  snapshot/      # YAML import/export
  shell-frame/   # rim geometry, notch animation, zones
  components/    # React UI (shell, start page, landing)
  …              # search, placement, internal-tools, focus-radio, etc.
```

Domain terminology and design decisions: [`CONTEXT.md`](./CONTEXT.md) and [`docs/adr/`](./docs/adr/).

## Releases

Version bumps and GitHub Releases are automated from [Conventional Commits](https://www.conventionalcommits.org/) on `main` via [semantic-release](https://semantic-release.gitbook.io/).

After the **CI** workflow passes on `main`, the **Release** workflow runs `npx semantic-release`, which:

- Analyzes commits since the last tag (`feat:` → minor, `fix:` → patch, `BREAKING CHANGE:` → major)
- Updates `package.json` and `CHANGELOG.md`
- Creates a Git tag and GitHub Release with generated notes

No npm publish — the package is `private`. Deploy is separate (see below).

**GitHub token:** The release workflow uses the built-in `GITHUB_TOKEN` with `contents: write` so semantic-release can push the version-bump commit, tag, and release. No extra secrets are required for GitHub Releases. If branch protection blocks `GITHUB_TOKEN` pushes to `main`, allow the token to bypass protection or use a dedicated bot PAT stored as a repository secret.

## Deployment

Yeti is a standard Next.js app. Build with `npm run build` and deploy the output to any Node-compatible host or SSR platform.

### Cloudflare Pages (recommended)

Deploy from the [Cloudflare dashboard](https://dash.cloudflare.com/) by connecting this GitHub repo — **no GitHub Actions deploy workflow** is required (CI and semantic-release stay separate).

Suggested project settings until a dedicated adapter is chosen:

| Setting                | Value                 |
| ---------------------- | --------------------- |
| Framework preset       | Next.js               |
| Build command          | `npm run build`       |
| Build output directory | `.next`               |
| Production branch      | `main`                |
| Node version           | 22 (matches `.nvmrc`) |

Enable preview deployments on pull requests if you want staging URLs. After the first production deploy, add the live URL here.

Release automation (issue 23) tags GitHub Releases only — Cloudflare rebuilds `main` on push independently.

## Repo name

The GitHub repo may still be named `quickshell-start`; the product and npm package name is **yeti**.
