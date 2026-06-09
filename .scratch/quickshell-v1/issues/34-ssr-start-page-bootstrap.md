Status: done

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Split Yeti into two product surfaces (ADR 0004):

- **Home station** (`/home`) — full **shell**, IndexedDB **library**, pinned all-day tab
- **Start page** (`/start`) — lightweight new-tab surface: SSR command bar, IndexedDB catalog, active **workspace** **theme** backdrop; no **shell** chrome
- **Landing page** (`/`) — minimal intro + CTA to `/home`

No URL-encoded themes or link payloads. Bookmark `/start` as the browser new-tab URL. Open `/home` once to seed the **library**; subsequent `/start` tabs read IndexedDB locally.

### Tracer bullets

| Issue | Slice |
|-------|-------|
| 35 | Route split — landing, `/home`, `/start` stub |
| 36 | Start page SSR shell + loading gate |
| 37 | Start page IDB search + starter fallback |
| 38 | Settings — `/start` URL copy |
| 39 | Bundle split verification |

Implement in order (35 → 36 → 37; 38 parallel after 35; 39 after 37).

### Out of scope

- URL-encoded catalog or theme in path
- Server-side personal library / auth
- Home station SSR improvements
- Landing page marketing site
- Replacing IndexedDB

## Acceptance criteria

- [x] `/`, `/home`, and `/start` routes exist with correct surface per ADR 0004
- [x] `/start` first HTML includes usable command bar; generic loading until IDB check completes
- [x] `/start` searches user's **library** when present; **starter template** + load-config prompt when absent
- [x] `/home` retains full **shell** behavior (issue 31 regressions unaffected)
- [x] Settings exposes copyable `/start` bookmark instructions
- [x] `/start` does not load full shell JS bundle

## Blocked by

None

## Comments

Product note (2026-06): grill-with-docs session reframed issue from "SSR bootstrap merge" to two-surface model. See ADR 0004 and `CONTEXT.md` (**Start page**, **Home station**, **Start page URL**).

Supersedes original bootstrap/merge architecture in this file's first draft.

Completed via issues 35–39.

**Follow-up:** Live library sync across `/home` and `/start` tabs → issue **45**.
