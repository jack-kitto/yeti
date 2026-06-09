Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Define and implement the **top rim** pocket — the control-center / dashboard surface (`ShellDashboard` today is tab placeholders only).

v1 scope (locked unless human revises):

- **Workspaces** — switch active workspace and glance at context (canvas switcher removed)
- **Calendar** (locked connection): **ICS feed URL** per **workspace** in settings — read-only, no OAuth in v1; works with Google/Apple/Fastmail secret calendar links
- **Calendar glance** (locked): **next up** — timed events from now forward only (hide past); all-day events shown for today until midnight; sorted chronologically
- **Calendar refresh** (locked): fetch on tab open + re-fetch every 15 minutes while Yeti tab is focused; show cached events while refreshing
- **Calendar interaction** (locked): click title opens event URL in new tab when present; expand control shows time/location/description inline
- **Calendar list cap** (locked): show up to **5** next-up events; **+N more** if overflow (expands inline or scroll — TBD at build)
- **Calendar empty state** (locked): setup prompt + button opens **settings** to workspace ICS field when no URL configured
- **Calendar errors** (implementation): inline error + retry on fetch/parse failure; ICS may require a same-origin proxy route if browser CORS blocks the feed host
- **Media** (locked behavior): built-in **focus radio** always available. **Media session** glance strip (title, artwork, prev/play/next) when another tab is playing; controlling external playback **auto-pauses** focus radio; radio can resume when external playback stops (if it was playing before)
- **Focus radio stations** (locked, licensing): **BYO only** — user adds stations in **settings** for their personal instance. No bundled SomaFM/Techno.FM catalog (see [SomaFM TOS](https://somafm.com/contact/tos.html): embed requires written permission; not for commercial redistribution)
- **Station kinds** (locked): `stream` (HTML5 Audio — Icecast/MP3 URL) and `youtube` (YouTube IFrame Player API — live stream/video URL)
- **Station fields** (locked): user `label`, `url`, `kind`; optional user `imageUrl` and `description` (no bundled broadcaster logos/metadata)
- **Station management** (locked): add / edit / remove / reorder in **settings**; media tab is player + searchable picker over saved stations only
- **Station picker UX** (locked): scrollable list + search/filter by label; optional **favorites** pin to top (user-flagged); active station highlighted
- **Now playing** (locked): current station label (+ optional image) at top of media tab while playing
- **Empty state** (locked): starter template has **no stations**; setup prompt + button to **settings** when list empty
- **Local dev seed** (locked): optional gitignored `yeti-radio.local.yaml` at repo root — if present on load, import into library radio preferences (personal instance only; never committed). Committed `yeti-radio.local.example.yaml` documents schema
- **Focus radio persistence** (locked): global (not per-workspace) — last station, volume, and playing/paused state in **library** preferences; survives reload
- **Focus radio controls** (locked): station picker, play/pause, volume slider, mute toggle — no visualizer/skip UI in v1
- **Stream failure** (locked): retry same `stream` station once after ~3s, then try next user station; inline error + manual retry only if all fail
- **Background playback** (locked): focus radio keeps playing when the control center pocket closes; pocket is the control surface only
- **No tasks tab** — tasks live on right rim only (issue 28)
- **Cut:** Performance tab (deferred), weather (out of v1)

**Implementation-only (no more product forks):** BYO station CRUD in settings + library schema; `stream` and `youtube` players; ICS CORS proxy if needed; pocket sizing/tab model vs deformation shell.

## Acceptance criteria

- [x] Human agrees on v1 tab(s) and widget scope for the top rim
- [ ] **Workspaces** tab switches workspace and shows active context
- [ ] **Calendar** tab: per-workspace ICS, next-up glance (5 cap, +N more), refresh on open + 15m, click/expand, setup prompt when unset
- [ ] **Media** tab: BYO focus radio (`stream` + `youtube`), settings CRUD, searchable picker, play-pause/volume/mute, global persistence, stream retry/fallback, setup prompt when empty, background playback when pocket closes
- [ ] Media session strip when another tab is playing; external transport auto-pauses radio
- [ ] Pocket sizing and scroll behavior feel intentional inside the rim shell
- [ ] Top rim does not duplicate settings (issue 26) or command bar (bottom rim)

## Blocked by

- `.scratch/quickshell-v1/issues/25-canvas-rim-shell.md` (done)

## Comments

`ShellDashboard` exists with Dashboard / Media / Performance / Workspaces tabs — all placeholder text. Workspace switching already lives on canvas + command bar; top-rim "Workspaces" tab may be cut or reduced to a glance view.

**Related:** issue 32 (canvas center widgets) — decide which widgets live on the canvas vs in the top rim before building either.
