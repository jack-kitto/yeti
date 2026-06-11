# Yeti

A developer-focused browser home station — spatial shell, edge link clusters, and a calm focus canvas. Local-first, no browser extension.

**Home station** (`/home`) is the full shell: pin it and work from it all day. **Start page** (`/start`) is a lightweight new-tab surface for instant search-and-launch. Both read the same **library** from IndexedDB in your browser.

Public preview: [https://github.com/jack-kitto/yeti](https://github.com/jack-kitto/yeti)

## Features

- **Spatial shell** — rim frame with notch-expanding edge menus, not a sidebar dashboard
- **Workspaces** — separate themes and link placements per context (e.g. Work, Personal); shared link catalog
- **Command bar** — keyboard-first fuzzy search for links, workspaces, and shell actions
- **Edge groups** — named link clusters on the left rim; control center (top), command bar (bottom), internal tools (right)
- **Launcher** — OS-style overlay for browsing a large link catalog
- **Internal tools** — pomodoro timer and focus tasks on the right rim
- **Canvas widgets** — clock, welcome message, quote, now playing, pomodoro, and focus tasks
- **Theme & layout presets** — bundled palettes and canvas layouts per workspace
- **Library snapshots** — export and import your entire setup as versioned YAML (dotfiles-friendly)
- **Offline-ready** — all data in IndexedDB; works on localhost or a hosted URL

## Quick start

Requires Node.js 22 (see `.nvmrc`).

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

## Library & portability

Your **library** — workspaces, link catalog, placements, themes, shortcuts, and tool state — lives in IndexedDB under the name `yeti`.

- **Export** — settings → export snapshot (`yeti-snapshot.yaml`)
- **Import** — load a snapshot from URL (e.g. a raw file in a GitHub dotfiles repo)
- **Reset** — `:reset` or settings; re-seeds the starter template (requires confirmation)

Snapshots reference theme background images by URL, not embedded bytes. Import replaces the local library. Cross-machine restore is manual via snapshot — **cloud library sync** is planned as a paid tier later.

## Demo recordings

Record polished clips and screenshots for social posts:

```bash
npm run dev          # in one terminal — port 3000
npm run demo         # record all WebReel scenarios
npm run demo:preview # preview timelines
```

See [`demo/README.md`](./demo/README.md) for WebReel config and output paths.

## Development

```bash
npm run dev          # Next.js dev server
npm run build        # production build
npm run start        # serve production build locally
npm test             # run tests (Vitest)
npm run test:watch   # watch mode
npm run lint         # xo
npm run format       # prettier
```

### Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion · Zustand · TanStack Query · IndexedDB (`idb`)

### Project layout

```
src/
  app/           # routes (/, /home, /start)
  library/       # domain model + IndexedDB persistence
  snapshot/      # YAML import/export
  shell-frame/   # rim geometry, notch animation, zones
  components/    # React UI (shell, start page, landing)
  …              # search, placement, internal-tools, focus-radio, etc.
```

Domain terminology and design decisions: [`CONTEXT.md`](./CONTEXT.md) and [`docs/adr/`](./docs/adr/).

## Releases

Version bumps and GitHub Releases are automated from [Conventional Commits](https://www.conventionalcommits.org/) on `main` via [semantic-release](https://semantic-release.gitbook.io/). Deploy is separate — Cloudflare Pages rebuilds from the dashboard when you push to `main`.

## Deployment (Cloudflare Pages)

Deploy from the [Cloudflare dashboard](https://dash.cloudflare.com/) by connecting this GitHub repo. **No GitHub Actions deploy workflow** — CI and semantic-release stay separate.

1. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Select **`jack-kitto/yeti`**, production branch **`main`**
3. Framework preset: **Next.js**
4. Build settings:

| Setting            | Value           |
| ------------------ | --------------- |
| Build command      | `npm run build` |
| Build output       | `.next`         |
| Node.js version    | `22`            |

5. Under **Settings → Functions**, enable the **`nodejs_compat`** compatibility flag for production and preview. Set compatibility date to **2024-09-23** or later.

Yeti uses Next.js API routes (`/api/focus-radio/stream`, `/api/calendar/ics`). If the default Pages build does not pick up server routes, follow Cloudflare’s [Next.js Workers guide](https://developers.cloudflare.com/workers/framework-guides/nextjs/) and add the OpenNext adapter — still dashboard-driven, no deploy action in this repo.

Optional: set `NEXT_PUBLIC_WAITLIST_URL` in Cloudflare environment variables to show a waitlist button on the landing page.

After the first production deploy, add your live URL at the top of this README.
