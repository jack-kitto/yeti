Status: done

## Parent

`.scratch/quickshell-v1/issues/27-top-rim-control-center.md`

## What to build

End-to-end **calendar** tab in the control center: per-workspace **ICS feed URL** in **settings**, fetch and parse on tab open, refresh every 15 minutes while focused, and show **next up** (5 events cap, +N more). Empty state links to settings; errors show inline with retry. Add a same-origin proxy route if browser CORS blocks the feed host.

## Acceptance criteria

- [x] Settings exposes ICS URL field per workspace
- [x] Calendar tab shows next-up events (timed from now; all-day until midnight)
- [x] Click title opens event URL; expand shows details inline
- [x] Fetch on tab open + 15m refresh while tab focused; cached events while refreshing
- [x] Setup prompt when no ICS URL configured

## Blocked by

- `.scratch/quickshell-v1/issues/40-control-center-workspaces-tab.md`

## Comments

Tracer bullet 2 of 4 for issue 27.

Shipped in `feat(calendar): add ICS feed settings and control center glance`.
