Status: done

## Parent

`.scratch/yeti-v2/PRD.md`

## What to build

Revise **landing page** copy, footer links, and logo treatment per product feedback (2026-06-11). Plain language for first-time visitors; setup story for developers migrating from Arc, Zen, or stock browsers.

## Product feedback (2026-06-11)

- **Hero headline** — drop “A riced desktop shell in your browser”. Avoid jargon (“shell”, “riced”). Prefer plain positioning, e.g. “The first start page that…” or “The Arc / Zen experience, as your start page”.
- **Logo** — no background fill around the icon on the landing header (mark only, no dark rounded rect).
- **Copy** — remove “on the rim” phrasing; use accessible language (edge bookmarks, start page, etc.).
- **Setup story** — reference the public **example config** repo (`jack-kitto/yeti-config`), optional **Chrome / Firefox extensions** for new-tab `/start`, and **Claude skills / scripts** for importing bookmarks from other browsers and authoring v2 YAML.
- **Footer** — remove link to domain glossary (`CONTEXT.md`). Add `/llms.txt` (or equivalent machine-readable site summary) per modern convention for crawlers and assistants.

## Acceptance criteria

- [x] Headline and tagline use plain language; no “shell”, “riced”, or “on the rim”
- [x] Landing header logo renders without icon background plate
- [x] Landing mentions example config repo, extensions, and import skills/scripts
- [x] Footer links to `/llms.txt` instead of `CONTEXT.md`
- [x] `landing-page.test.ts` updated; `npm test` passes

## Blocked by

None — copy can ship before example repo and extension are published (links may point at planned URLs)

## Comments

**Jack (2026-06-11):** Captured from landing review session. Extension and example repo issues remain separate (07, 03, 04); this issue is copy + landing module only.

**Jack (2026-06-11, copy v2):** Headline → “Make any browser your home”. Body → bookmarks not locked to one browser; keystroke access + quickshell spatial navigation for pinned tabs.
