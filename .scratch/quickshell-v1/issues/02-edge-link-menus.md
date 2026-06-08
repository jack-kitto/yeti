Status: wontfix

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Wire up all three link **edges** (left, top, bottom) with identical flyout behavior.

Implement the **Placement** resolver for edge groups and the **Link display** module (custom title/image if provided; favicon and URL-derived title as fallbacks). Each **edge menu** opens on hover and closes when the pointer leaves. Click the edge handle to pin the flyout open until dismissed.

Show up to 8 **links** per edge in user order, with a "see more" affordance when the group exceeds 8 (can open a stub or no-op until the launcher slice lands). Clicking a link always opens a new tab.

Add Placement and Link display unit tests.

## Acceptance criteria

- [x] Hovering left, top, or bottom edge opens a flyout showing that edge's link group from the active workspace
- [x] Flyout closes on pointer leave; click handle pins flyout open until dismissed
- [x] Each flyout shows at most 8 links; "see more" appears when group has more than 8
- [x] Link display resolves title and image with correct fallbacks
- [x] Clicking any flyout link opens `target="_blank"`
- [x] Placement and Link display modules have unit tests

## Blocked by

- `.scratch/quickshell-v1/issues/01-boot-the-shell.md`

## Comments

Superseded by grill session (2025-06). The shipped v1 used invisible edge zones and centered flyouts — not the intended **edge group** / **edge handle** model. Replaced by issues 13–15 and 18. Link display and basic placement tests from this slice remain valid; edge UI and schema do not.
