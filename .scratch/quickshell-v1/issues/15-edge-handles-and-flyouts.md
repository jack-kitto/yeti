Status: done

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Replace the invisible edge hit zones with visible **edge handles** — one per **edge group**. Handles render along the rim at positions derived from viewport length and minimum spacing (**edge slots**). Hover a handle → **edge flyout** opens anchored to that handle (not screen-center). Click handle pins flyout until dismissed.

Drag a handle along the rim on the live shell; snap to nearest slot on release. Drop on occupied position inserts (push neighbors) and assigns a new **fractional order** key. Up to 8 links per flyout; **see more** opens the **launcher** scoped to that edge group.

Supersedes the v1 implementation in issue 02.

## Acceptance criteria

- [x] Each edge group shows a visible handle icon on its edge (image → emoji → initials fallback)
- [x] Flyout opens from the handle anchor on hover; closes on pointer leave unless pinned
- [x] Viewport-responsive slot layout; drag on rim reorders with snap and insert-on-occupied
- [x] Flyout shows up to 8 links; "see more" opens launcher for that edge group
- [x] Left, top, bottom edges share the same interaction model
- [x] Clicking a flyout link opens a new tab

## Blocked by

- `.scratch/quickshell-v1/issues/14-edge-groups-model.md`
