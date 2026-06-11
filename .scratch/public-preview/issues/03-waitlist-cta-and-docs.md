Status: ready-for-agent

## Parent

`.scratch/public-preview/PRD.md`

## What to build

Finalize waitlist integration for the **landing page**: `NEXT_PUBLIC_WAITLIST_URL` shows **Join the waitlist** CTA linking externally; when unset, CTA is hidden.

Document setup in README (Tally/Buttondown example). Add test that waitlist href appears only when env is set (mock `process.env` in vitest).

No in-app email collection. Waitlist copy must reference future **cloud library sync**, not current features.

## Acceptance criteria

- [ ] Waitlist CTA hidden when env unset; visible with correct href when set
- [ ] Test covers both env states
- [ ] README documents `NEXT_PUBLIC_WAITLIST_URL` for Cloudflare env vars
- [ ] `npm test` and `npm run build` pass

## Blocked by

None — can start immediately
