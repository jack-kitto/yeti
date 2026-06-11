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
- **Example config** — fork [jack-kitto/yeti-config](https://github.com/jack-kitto/yeti-config) for a starter `library.yaml` and agent skills to author your own
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

## Deployment (Cloudflare Workers)

Deploy from the [Cloudflare dashboard](https://dash.cloudflare.com/) by connecting this GitHub repo via **Workers Builds**. **No GitHub Actions deploy workflow** — CI and semantic-release stay separate.

Yeti uses Next.js API routes (`/api/focus-radio/stream`, `/api/calendar/ics`). The [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare) bundles the app for the Workers runtime — vanilla `next build` + `.next` output is not sufficient.

1. **Workers & Pages** → **Create** → **Workers** → **Connect to Git**
2. Select **`jack-kitto/yeti`**, production branch **`main`**
3. Build settings (Node.js **22**). Leave the build output directory empty — the adapter writes to `.open-next/`.

**Option A — single command (recommended):**

| Setting         | Value              |
| --------------- | ------------------ |
| Build command   | _(leave empty)_    |
| Deploy command  | `npm run deploy`   |

**Option B — split build + deploy:**

| Setting         | Value                              |
| --------------- | ---------------------------------- |
| Build command   | `npm run cf:build`                 |
| Deploy command  | `npx opennextjs-cloudflare deploy` |

Do **not** use the old Cloudflare Pages preset (`npm run build` + `.next` output) — that worked before OpenNext but cannot run API routes on Workers.

`npm run cf:build` runs OpenNext **and** a post-build worker patch required for cold starts. Plain `opennextjs-cloudflare build` is not enough.

4. Under **Settings → Compatibility**, enable **`nodejs_compat`** and set compatibility date to **2024-09-23** or later.

### Local Cloudflare preview

```bash
cp .dev.vars.example .dev.vars   # once — local only, not committed
npm run preview                  # cf:build + wrangler dev
```

### Environment variables

| Variable                   | Required | Purpose                                              |
| -------------------------- | -------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_WAITLIST_URL` | No       | External waitlist form URL (Tally, Buttondown, etc.) |
| `NEXT_PUBLIC_SITE_URL`     | No       | Production URL for Open Graph absolute image links   |

When `NEXT_PUBLIC_WAITLIST_URL` is set in Cloudflare environment variables, the landing page shows a **Join the waitlist** button linking to your external form. When unset, the button is hidden.

After the first production deploy, set `NEXT_PUBLIC_SITE_URL` to your live URL and add the URL at the top of this README.
