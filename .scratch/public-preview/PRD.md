# Public preview launch — Product Requirements Document

Status: ready-for-agent

## Problem Statement

Yeti’s **home station** and **start page** work locally, but there is no public URL for the hackathon demo, build-in-public posts, or early interest capture. The existing **landing page** was minimal (name, tagline, one CTA). Visitors need to understand what Yeti is, try the **local tier** preview immediately, and optionally join a waitlist for **cloud library sync** later — without implying live sync or accounts exist today.

The product direction is monetization-ready: **local tier** (free, IndexedDB + **library snapshot** portability) and paid **cloud library sync** later. Public repo is live at `jack-kitto/yeti`. Deploy target is **Cloudflare Pages** (dashboard-driven, no GitHub deploy action).

## Solution

Ship a **public preview** at `/` on a Cloudflare Pages URL:

1. **Landing page** — product story (Arc/Zen → portable start page), hero visual, three value props, primary CTA to **home station**, secondary to **start page**, optional waitlist link via `NEXT_PUBLIC_WAITLIST_URL`, honest **local tier** disclaimer.
2. **Live deploy** — Cloudflare Pages connected to `jack-kitto/yeti` on `main`, with Next.js API routes working (focus radio stream proxy, calendar ICS).
3. **Interest capture** — external waitlist form (Tally, Buttondown, etc.); no custom backend in this phase.
4. **Discoverability** — Open Graph / social metadata, favicon, GitHub link; README updated with live URL after deploy.

Partial landing work is already merged (`feat(landing): add preview marketing page with hero and feature grid`). Remaining work is polish, deploy plumbing, and launch ops.

## User Stories

### Landing page

1. As a first-time visitor, I want the **landing page** at `/` to explain what Yeti is in plain language, so that I know whether to try it.
2. As a first-time visitor, I want a hero image showing the **shell** and **rim menu**, so that the rice aesthetic is immediately visible.
3. As a first-time visitor, I want a primary CTA to open the **home station**, so that I can try the full **shell** in one click.
4. As a first-time visitor, I want a secondary path to the **start page**, so that I understand the new-tab use case.
5. As a developer, I want copy that explains browser-agnostic / dotfiles portability, so that the Arc/Zen story lands without overselling sync.
6. As a developer, I want an honest note that this is **local tier** only, so that I am not surprised that data stays in my browser.
7. As a interested visitor, I want a waitlist CTA when configured, so that I can hear about **cloud library sync** without creating an account.
8. As someone sharing a link on X, I want Open Graph title, description, and image, so that the preview card looks good.
9. As a mobile visitor, I want the landing layout to read cleanly on a phone, so that hackathon demos work on any device.
10. As an open-source curious visitor, I want a link to the GitHub repo, so that I can inspect the client code.

### Deploy & hosting

11. As the product owner, I want Yeti deployed on **Cloudflare Pages**, so that hosting matches the planned production stack.
12. As the product owner, I want deploys triggered by pushes to `main` via Cloudflare dashboard Git integration, so that no deploy GitHub Action is required.
13. As a user on the hosted URL, I want `/home` and `/start` to work identically to localhost, so that the preview is representative.
14. As a user on the hosted URL, I want focus radio stream proxy and calendar ICS API routes to work, so that demo features do not break on production.
15. As the product owner, I want README to document final Cloudflare build settings after adapter choice, so that future agents do not guess.

### Launch ops

16. As the product owner, I want `NEXT_PUBLIC_WAITLIST_URL` documented, so that enabling the waitlist button is a one-line env change in Cloudflare.
17. As the product owner, I want the production URL recorded in README after first deploy, so that build-in-public posts can link to it.
18. As the product owner, I want demo clips recordable against the production URL, so that X posts show the live preview.

## Implementation Decisions

### Landing content module

- Landing copy and CTAs live in a pure content module (`getLandingPageContent`) consumed by the landing React component — same pattern as existing landing tests.
- Waitlist URL comes from `NEXT_PUBLIC_WAITLIST_URL` at build time; when unset, waitlist CTA is hidden (not a broken link).
- Copy uses domain terms: **landing page**, **home station**, **start page**, **library**, **library snapshot**, **local tier**, **cloud library sync** (future).
- Hero still image ships in `public/landing/`; optional hero video loop is a separate slice (muted, autoplay, poster = still).

### Social metadata

- Extend Next.js `metadata` for `/` with `openGraph` and `twitter` fields using landing headline, tagline, and hero image URL (absolute URL requires `metadataBase` set from env or production host).
- Add favicon / app icon under `public/` if missing.

### Cloudflare deployment

- Deploy via Cloudflare dashboard → Pages → connect `jack-kitto/yeti`, branch `main`.
- Yeti has dynamic API routes; vanilla `next build` + `.next` output is insufficient on Pages. Use **OpenNext Cloudflare adapter** (`@opennextjs/cloudflare`) per Cloudflare’s current Next.js guidance — not deprecated `@cloudflare/next-on-pages`.
- API route handlers must use Edge-compatible patterns where required by the adapter.
- Enable `nodejs_compat` compatibility flag; Node 22 for build.
- No GitHub Actions deploy workflow — dashboard-driven only (per issue 24).
- Optional env: `NEXT_PUBLIC_WAITLIST_URL`.

### Waitlist

- External form only (Tally, Buttondown, Google Form) — no Yeti backend, no auth, no email collection in the app.
- Waitlist promises updates on **cloud library sync** and launch — not access gating on `/home`.

### Commercial alignment

- Public client repo is intentional; monetization is **cloud library sync**, not secret source.
- Landing must not claim “sync across devices” for the free preview.

### Testing seams (preferred)

1. **`getLandingPageContent`** — unit tests for copy structure, routes, waitlist null/non-null (mock env).
2. **Landing route metadata** — unit test on exported metadata helper if split from page; or snapshot test on metadata object.
3. **Deploy verification** — manual smoke on production URL (human); optional script that curls `/`, `/home`, `/start`, and one API route.

Existing seam: `landing-page.test.ts` already tests content module. Prefer extending that over new e2e infrastructure.

## Testing Decisions

- Test **external behavior** only: rendered content strings, href targets, conditional waitlist CTA, metadata fields.
- Do not test CSS class names or layout pixel values.
- Prior art: `src/landing/landing-page.test.ts`, `src/branding/site-metadata.test.ts`.
- Deploy adapter changes: run `npm test` + `npm run build` locally; smoke test API routes on preview URL after deploy.

## Out of Scope

- **Cloud library sync** backend, auth, billing
- Custom waitlist API or in-app email forms
- Gating `/home` behind login or paywall
- Full marketing site (blog, pricing page, docs site)
- Theme preset polish across all six presets (separate backlog)
- GitHub Actions deploy workflow
- Vercel or other hosts
- Domain purchase and DNS (human ops; document placeholder in README)
- X post publishing (human)

## Further Notes

- Repo: https://github.com/jack-kitto/yeti (public)
- Issue 34 originally scoped landing marketing site out of v1; public preview reframes an expanded **landing page** without changing **home station** / **start page** contracts (ADR 0004).
- Hackathon demo path: landing → `/home` → hover edge notch → command bar.
- X post draft direction: rice inspiration, “calm canvas to lock in”, link to live URL; rice source as reply thread.
- Related: `.scratch/quickshell-v1/issues/24-cloudflare-pages-deploy.md` (human deploy; README partially done).
