Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Enhance the **canvas center** — the primary focus area below/alongside workspace switcher and pin strip — with configurable at-a-glance content.

v1 canvas widgets (locked):

- **Clock / date** — always-on ambient
- **Welcome message** — time-of-day or workspace name
- **Quote** — static rotating list; themes: design, innovation, engineering, coding/programming, productivity; include funny **grug-brained developer** lines that still hit hard. No API.

Out of v1: weather (deferred), anything duplicated in **control center** (issue 27)

Users enable/configure widgets from **settings** (not a rim surface). Widget toggles **per-workspace** (locked).

**Relationship to issue 27:** top rim = control-center pocket; **this issue = center canvas** home screen. Avoid duplicating the same widget in both unless intentional.

## Acceptance criteria

- [ ] Widget layout: vertical stack at optical center, slight upward bias (~40% from top) (locked)
- [ ] At least two widget types render on canvas with real data (not lorem)
- [ ] Settings UI toggles/configures which widgets show (minimal: on/off per widget)
- [ ] Widget layout respects active workspace theme tokens
- [ ] Canvas is widget-only — no pin strip or workspace switcher on canvas (pins removed; switcher in control center + command bar)

## Also in scope

Remove pin strip, pin placements UI, and canvas workspace switcher (grill 2025-06). Issues 03, 10 → wontfix.

## Blocked by

None — implementation may follow issue 26 (settings entry stable)

## Comments

Backlog item 2025-06. "Configured from the right panel" → **settings dialog** per product direction (issue 26). Weather/quotes overlap conceptually with issue 27 top-rim tabs — decide center vs top-rim split before AFK build.
