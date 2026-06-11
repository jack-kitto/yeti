Status: ready-for-agent

## Parent

`.scratch/public-preview/PRD.md`

## What to build

Add social sharing metadata for the **landing page** so X and other platforms show a proper preview card.

Set `metadataBase` for absolute OG image URLs. Export Open Graph and Twitter card fields using the landing headline, tagline, and hero still (`/landing/hero.png`). Add a favicon under `public/` if none exists.

Landing route metadata must not leak into **home station** or **start page** tab titles beyond the existing global default.

## Acceptance criteria

- [ ] `/` serves OG title, description, and image suitable for link previews
- [ ] Twitter card metadata present
- [ ] `metadataBase` resolves correctly on localhost and production (env or sensible default)
- [ ] Favicon appears in browser tab on `/`
- [ ] Unit test covers metadata helper or landing metadata export
- [ ] `npm test` and `npm run build` pass

## Blocked by

None — can start immediately
