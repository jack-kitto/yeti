Status: ready-for-human

## Parent

`.scratch/public-preview/PRD.md`

## What to build

Connect **Cloudflare Pages** to `jack-kitto/yeti` in the dashboard and ship the first production deploy.

Human steps: Workers & Pages → Create → Pages → Git → `jack-kitto/yeti`, branch `main`, build settings per README (post issue 04), `nodejs_compat` flag, Node 22. Set `NEXT_PUBLIC_WAITLIST_URL` when waitlist form exists.

Smoke test: `/`, `/home`, `/start`, edge notch, command bar, focus radio stream.

## Acceptance criteria

- [ ] Production URL is live on Cloudflare Pages
- [ ] Pushing to `main` triggers automatic rebuild
- [ ] `/home` and `/start` work on production
- [ ] API routes work on production
- [ ] README updated with live production URL at top

## Blocked by

- `.scratch/public-preview/issues/04-opennext-cloudflare-adapter.md`

## Comments

Supersedes the mechanical deploy checklist in `.scratch/quickshell-v1/issues/24-cloudflare-pages-deploy.md` for the public-preview launch. Issue 24 README documentation criterion is already satisfied; production URL criterion moves here.
