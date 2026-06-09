Status: done

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Repurpose the **right rim** from config to an **internal tools edge** — same interaction model as the left **edge** (handles, flyouts, fractional order along the rim), but for in-shell apps rather than external bookmark links.

**Left edge:** catalog links → external sites (bookmarks).  
**Right edge:** built-in tools → dev productivity inside the shell.

### v1 tool priority (decided)

Ship in order:

1. **Pomodoro** — timer in a right-edge flyout (start/pause/reset, session state). Multiple preset **splits** (work/break/long-break combos) plus a **custom split** option; per-workspace state. Optional end-of-session chime (flyout toggle, off by default). Persist running timer across reload (`endsAt` in library).
2. **Tasks** — **focus task** list in a right-edge flyout: title, optional time estimate, add/complete/reorder (**fractional order**), local-only. Hybrid lifecycle (locked): persistent backlog + per-task **today** flag; flyout defaults to today. Light pomodoro coupling (locked): **Start focus** sets active task + starts work interval; timer flyout shows active task; complete from either flyout.

Later (out of v1 scope for this issue): notes, stickies, other widgets.

### Architecture (needs ADR before AFK build)

Decide before implementation:

- Tool registration model (locked): first-class **internal tool** records in the **library**, separate from **edge groups** — not link-kind reuse
- Persistence (locked): timer state and tasks live in the **library** aggregate — same IndexedDB store, included in **library snapshot** export/import
- Workspace scope (locked): **per-workspace** — tasks and pomodoro state are independent per workspace
- Parity with left edge UX (locked): handles, flyout anchor, pin-to-keep-open, fractional order for handle position. Rim drag-reorder deferred — v1 fixed order (pomodoro above tasks).

### Tracer bullets

| Phase | Deliverable |
|-------|-------------|
| A | ADR + right rim renders tool handles (pomodoro handle + flyout, minimal timer) |
| B | Tasks handle + flyout with persisted task list per workspace |
| C | Config or settings surface to enable/reorder right-edge tools (or document v1 fixed pair) |

## Acceptance criteria

- [x] ADR records tool model, persistence, and left/right edge UX parity for v1
- [x] Right rim hosts edge-style handles (not settings — see issue 26)
- [x] **Pomodoro** usable from a right-edge flyout (start/pause at minimum)
- [x] **Tasks** usable from a right-edge flyout (add + complete at minimum; persists across reload)
- [x] Pomodoro and tasks each have their own handle on the right rim
- [x] Settings are not accessed from the right rim

## Blocked by

- `.scratch/quickshell-v1/issues/26-relocate-settings-entry.md` (free the right rim)

## Comments

Product direction (2025-06): mirror the left rim's spatial model for apps inside the shell. Config for external links stays in the settings dialog.

**v1 tools locked:** pomodoro first, then tasks. Notes/stickies deferred.

**Refinement (2026-06):** Right-rim tool handles use **ghost** styling (no glass card) — the narrow `frameRight` rim cannot fit the standard `shell-icon-btn` surface without overflowing into the canvas.

**Follow-up:** Deep v1 behavior → issue **46**; tasks flyout height → issue **49**.
