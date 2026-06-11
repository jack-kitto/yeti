# Yeti v2 — Product Requirements Document

Status: ready-for-agent

## Problem Statement

Yeti v1 delivered the full **shell**, **start page**, and **library snapshot** portability, but several gaps block daily use and public launch:

1. **Library snapshots are machine-first** — a global **link catalog** with IDs cross-referenced from `placements.edgeGroups` and fractional order keys is unusable in dotfiles without a generator script.
2. **New-tab keyboard workflow is broken** — Ctrl+T leaves focus in the browser omnibox; the **start page** **command bar** cannot receive keystrokes without an extra click (browser policy, not a Yeti bug).
3. **Configuration is split awkwardly** — a large **settings** modal duplicates what YAML and the **control center** should own.
4. **Landing and launch polish** — hero assets captured from dev builds, no theme variety on the marketing page, no scroll-driven demo of the **edge flyout** interaction.
5. **No published example config** — no public repo, sample YAML, or skills for importing browser bookmarks into a Yeti **library**.

## Solution

Yeti v2 is a post-v1 hardening and ergonomics phase — no change to the two-surface model (ADR 0004). Six workstreams:

| Stream | Outcome |
| ------ | ------- |
| **Snapshot v2** | Human-editable YAML with per-workspace **bookmarks** (inline links, array order). v1 import preserved. ADR 0009. |
| **Config surface** | **Command bar** actions for quick capture; **control center** for presets; deprecate **settings** modal. ADR 0011. |
| **New-tab extension** | Minimal Chrome/Firefox extension for new-tab URL + focus. ADR 0010. |
| **Example config repo** | Public repo with sample `yeti.yaml`, radio example, and Claude skills for authoring and browser import. |
| **Landing polish** | Production hero capture, scroll-linked **edge flyout** demo video, multi-**theme preset** showcase, copy refresh. |
| **Edge polish** | Left/right rim handle and flyout visual pass (post solid-shell fixes, issues 80–81). |

Shell rendering: solid-only fill and notch corner fix are **done** (issues 80–81, ADR 0008).

## User Stories

### Library snapshot v2

1. As a developer, I want to edit my Yeti setup in YAML without managing link IDs, so that dotfiles stay human-readable.
2. As a developer, I want bookmark groups with inline `name`, `url`, `title`, `icon`/`image` fields, so that I write links once per group.
3. As a developer, I want array order in YAML to determine flyout order, so that reordering is cut-and-paste not opaque order keys.
4. As a developer, I want duplicate URLs across groups and workspaces allowed in YAML, so that I do not fight deduplication when authoring.
5. As a developer, I want v1 snapshots to still import, so that existing dotfiles do not break.
6. As a developer, I want export to produce v2 YAML by default, so that new backups use the human format.

### Config without settings modal

7. As a developer, I want `:add` (or similar) in the **command bar** to capture a URL into the **link catalog**, so that I do not open **settings** for one link.
8. As a developer, I want `:task` to quick-add a **focus task**, so that capture stays keyboard-first.
9. As a developer, I want `:import` / `:export` as **command bar actions**, so that snapshot workflows do not require the modal.
10. As a developer, I want **theme preset** and **layout preset** apply to remain in the **control center**, so that look changes stay on the rim.
11. As a developer, I want the **settings** modal removed once parity exists, so that config has one mental model.

### Browser extension

12. As a developer, I want a one-click extension install that sets `/start` as my new-tab URL, so that setup does not require manual bookmark instructions.
13. As a developer, I want the extension to focus the **start page** **command bar** after Ctrl+T when possible, so that keyboard-first new-tab search works.
14. As a developer, I want the extension to do nothing beyond new-tab setup, so that I trust it and the app stays local-first.

### Example config repo and skills

15. As a developer, I want a public example-config repo with a annotated `yeti.yaml`, so that I can fork and customize.
16. As a developer, I want Claude skills that help design bookmark layout and import Chrome/Firefox/Arc bookmarks, so that migration from other browsers is guided.
17. As a developer, I want the main Yeti README to link to the example repo, so that discoverability is obvious.

### Landing page

18. As a first-time visitor, I want scroll-linked video showing a **bookmark** **edge flyout** opening, so that the rice interaction is obvious without installing.
19. As a first-time visitor, I want hero imagery captured from production builds (no dev-tool chrome), so that marketing looks polished.
20. As a first-time visitor, I want to see multiple **theme presets** on the landing page, so that the product does not look single-skinned.
21. As a first-time visitor, I want updated copy that reflects snapshot v2 and extension-assisted setup, so that the story matches reality.

### Edge polish

22. As a developer, I want left **edge group** handles and flyouts visually refined, so that the rim feels as polished as the canvas.
23. As a developer, I want right-rim **internal tool** handles and flyouts visually refined, so that both sides feel balanced.

### Start page fallback

24. As a developer without the extension, I want a documented fallback (pin `/home` or mouse-first `/start`), so that I understand tradeoffs.

## Implementation Decisions

### Snapshot module (v2)

- Bump `SNAPSHOT_VERSION` to `2`. v2 shape: `workspaces[].bookmarks[]` with inline link rows; drop top-level `catalog` and `placements.edgeGroups` from export.
- Import v2: generate link IDs (slug from URL/title), assign fractional keys from array index, merge into runtime **library** model.
- Import v1: unchanged path; export can offer v1 for compatibility if needed (default v2).
- Rename portable term **bookmarks** maps to runtime **edge groups** on the left **edge** only; no `top`/`bottom` edge group arrays in v2.

### Command bar actions

- Extend `COMMAND_BAR_ACTIONS` with `:add`, `:task`, `:import`, `:export` (exact set per issues).
- **Start page** may gain a subset (`:import` only) or stay search-only until extension handles setup — decision in issue 08.

### Settings deprecation

- Phase 1: parity on command bar + control center + YAML.
- Phase 2: remove `ShellConfigDialog` and `:settings` action; update CONTEXT.md and README.

### Extension

- Separate package directory or repo (`yeti-extension/`); manifest v3 (Chrome) + gecko (Firefox).
- `chrome_url_overrides.newtab` → user-configured Yeti origin + `/start`.
- Optional `chrome.tabs.onUpdated` focus hook — test per browser.

### Landing scroll video

- Record WebReel clip of left-rim handle hover → **edge flyout** expand (production build).
- Scroll-driven playback (e.g. `scroll-timeline` or lightweight JS scrubber) on a landing section; `prefers-reduced-motion` shows poster still.
- Does not ship in **home station** bundle.

### Example config repo

- New GitHub repo (e.g. `jack-kitto/yeti-config`) with `yeti.yaml`, `yeti-radio.example.yaml`, `.cursor/skills/` or `.claude/skills/` for import and layout authoring.
- Main repo keeps `scripts/generate-jack-yeti-config.ts` as reference; v2 export replaces its output shape over time.

## Testing Decisions

- **Snapshot**: round-trip v2, v1→import, v2→import fidelity, array-order → fractional key mapping. High priority.
- **Command bar actions**: action matching and side effects on **library** through public module interfaces.
- **Landing content module**: scroll-video config, reduced-motion fallback, href targets — extend `landing-page.test.ts`.
- **Extension**: manual smoke per browser; no e2e in main repo CI initially.

## Out of Scope

- **Cloud library sync**, auth, billing
- Full bookmark manager in the extension
- Replacing IndexedDB with server storage
- Agent host (issue 29)
- Auto-migration of on-disk IDB schema beyond snapshot import

## Further Notes

- ADRs: 0008 (solid shell, done), 0009 (snapshot v2), 0010 (extension), 0011 (yaml-first config).
- v1 PRD remains `done`; this PRD is the active backlog.
- Public preview deploy (`.scratch/public-preview/`) continues in parallel — landing stories overlap issues 10–12 here.
