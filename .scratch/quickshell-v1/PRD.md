# Yeti v1 — Product Requirements Document

Status: done

## Problem Statement

Developers juggle dozens or hundreds of links, tools, and contexts across work and personal life. Traditional browser start pages and bookmark managers feel like cluttered websites — sidebars, dashboards, folder hierarchies — not a calm place to work from.

Developers who rice their Linux desktops (Hyprland, Quickshell) get a spatial shell: controls on screen edges, a large central canvas, contextual flyouts, and keyboard-first workflows. Nothing like that exists as a browser homepage they can open on any machine without installing a browser extension.

**Yeti** solves this: a personal, local-first browser shell that feels like a lightweight operating system — edge-attached link menus, a central canvas with ambient widgets, workspace-scoped themes and layouts, internal tools on the right rim, and a master link catalog — delivered as a web app (localhost or hosted URL).

## Solution

Yeti is a developer-focused productivity shell with **two surfaces**:

| Route | Surface |
|-------|---------|
| `/` | **Landing page** — minimal intro and links to home/start |
| `/home` | **Home station** — full shell; pin and work from it all day |
| `/start` | **Start page** — lightweight new-tab search-and-launch |

On the **home station**:

- The **canvas** shows configurable **canvas widgets** (clock, welcome, quote, now playing, focus tasks, pomodoro) — no pin strip, no workspace switcher, no command bar on canvas.
- The **left rim** hosts **edge groups** — hover a handle to open a contextual **edge flyout** (up to 8 links, then "see more" → **launcher**). Click the handle to pin the flyout open.
- The **top rim** opens the **control center** — workspaces tab, calendar (ICS), and focus radio media tab.
- The **bottom rim** opens the **command bar** — keyboard-first fuzzy search for links, workspaces, and shell actions (`:settings`, `:reset`).
- The **right rim** hosts **internal tools** (pomodoro timer, focus tasks) — each with its own handle and tool flyout.
- **Settings** open as a centered dialog via `:settings` or the top-right settings control — not a right-rim hover panel.

A shared **link catalog** holds all links. **Workspaces** partition theme, placements, canvas widgets, internal tool state, and calendar feed. Search is workspace-first with full-catalog fallback on the home station; the start page searches the full catalog.

All data persists in **IndexedDB**. Portability via versioned **YAML library snapshots** (import/export, load from URL).

First run ships an opinionated **starter template**: Work and Personal workspaces, distinct themes, sample dev links on edge groups.

## User Stories

### Surfaces & routing

1. As a developer, I want a **landing page** at `/` that explains Yeti and links to home and start, so that first-time visitors know where to go.
2. As a developer, I want a **home station** at `/home` with the full shell, so that I can pin one tab and work from it all day.
3. As a developer, I want a **start page** at `/start` as my browser new-tab URL, so that every new tab is instant search-and-launch without loading the full shell.
4. As a developer, I want both surfaces to read the same **library** from IndexedDB, so that links and themes stay in sync across tabs.
5. As a developer, I want to open `/home` once to seed the starter template, so that `/start` works immediately afterward.

### Shell & layout

6. As a developer, I want the interface to feel spatial and OS-like — glass rim frame, central canvas, minimal chrome — so that it does not feel like a traditional website dashboard.
7. As a developer, I want a large central **canvas** as my primary focus area, so that I spend most of my time there rather than in chrome.
8. As a developer, I want the shell to expand into a **notch** on rim hover, so that menus feel attached to the screen edge like a rice'd desktop.
9. As a developer, I want soft warm visuals with glassmorphism, large radii, and gentle motion, so that the shell feels polished and calm.
10. As a developer, I want spring-based panel animations, so that flyouts and transitions feel physical and responsive.
11. As a developer, I want no traditional sidebar, top navbar, or widget dashboard, so that the shell stays spatial and uncluttered.

### Canvas

12. As a developer, I want configurable **canvas widgets** per workspace (clock, welcome, quote, now playing, focus tasks, pomodoro), so that the canvas shows ambient at-a-glance content.
13. As a developer, I want canvas widgets toggled on/off per workspace in **settings**, so that I control what appears on each context.
14. As a developer, I want focus tasks and pomodoro widgets to read the same state as the right-rim tools, so that there is no duplicate task or timer store.
15. As a developer, I want primary actions on canvas widgets (start/pause timer, start focus, complete task) with dense editing on the right rim, so that canvas stays glanceable.
16. As a developer, I want the now-playing widget to persist while paused until I dismiss it, so that I can glance at what was playing without it vanishing immediately.
17. As a developer, I want links reachable via edge groups, the command bar, and the launcher — not pinned on the canvas — so that the canvas stays calm.

### Command bar

18. As a developer, I want a **command bar** on the bottom rim, so that I can keyboard-first jump to any link.
19. As a developer, I want the command bar to search my active workspace's placed links first, so that daily links surface immediately.
20. As a developer, I want the command bar to fall back to the full link catalog when no workspace match exists, so that I can still reach unplaced links.
21. As a developer, I want fuzzy matching in the command bar, so that I can find links without typing exact titles.
22. As a developer, I want shell actions via `:` prefix (`:settings`, `:reset`), so that configuration is keyboard-reachable.
23. As a developer, I want type-to-focus — printable keys open the command bar when focus is not in a text field — so that keyboard-first workflow is immediate.

### Control center

24. As a developer, I want a **control center** on the top rim, so that I can glance at workspaces, calendar, and media without leaving the shell.
25. As a developer, I want a workspaces tab to switch and glance at active context, so that mouse users can change workspace from the top edge.
26. As a developer, I want a calendar tab with per-workspace ICS feed URLs, so that I can see upcoming events read-only without OAuth.
27. As a developer, I want a media tab with BYO focus radio stations, so that I can play personal stream or YouTube live links.
28. As a developer, I want focus radio playback to continue when the control center closes, so that music is not tied to the notch being open.

### Edge menus

29. As a developer, I want multiple **edge groups** on the left rim, each with a named handle and flyout, so that I organize links into contextual clusters.
30. As a developer, I want hovering an edge handle to open its flyout, so that I can access links quickly without clicking.
31. As a developer, I want the flyout to close when my pointer leaves, so that the shell stays clean.
32. As a developer, I want to click an edge handle to pin its flyout open, so that I can browse links without holding hover.
33. As a developer, I want each flyout to show up to 8 links in my chosen order, so that flyouts stay scannable.
34. As a developer, I want a "see more" action when an edge group has more than 8 links, so that I can access the full group without a cramped flyout.
35. As a developer, I want the same link to appear in multiple edge groups within a workspace, so that I can surface important links in more than one context.

### Internal tools

36. As a developer, I want a pomodoro timer on the **right rim**, so that I can run focus splits without leaving the shell.
37. As a developer, I want configurable focus splits (built-in presets plus custom), so that I can match my work rhythm.
38. As a developer, I want a focus countdown mode from task estimates, so that I can run single-interval timers without phase cycling.
39. As a developer, I want a focus task list on the right rim with today/backlog views, estimates, and reorder, so that I can track lightweight dev tasks.
40. As a developer, I want **Start focus** to arm a task and open the pomodoro flyout without auto-starting the timer, so that I pick the split and press Start explicitly.
41. As a developer, I want internal tool state per workspace, so that Work and Personal have independent timers and tasks.

### Launcher

42. As a developer, I want a launcher overlay that feels like an OS app launcher, so that browsing many links is visual and comfortable.
43. As a developer, I want to open the launcher via "see more" from an edge flyout, so that edge groups scale beyond 8 links.
44. As a developer, I want the launcher to default to my active workspace's links, so that browsing stays context-aware.
45. As a developer, I want to toggle the launcher to show the full link catalog, so that I can browse everything when needed.
46. As a developer, I want search/filter inside the launcher, so that I can find links in a large catalog.
47. As a developer, I want the launcher to be separate from the command bar, so that jump-to and browse are distinct workflows.

### Settings

48. As a developer, I want to open **settings** via `:settings` or a top-right control, so that configuration is always accessible without a right-rim panel.
49. As a developer, I want settings in a centered dialog with scrollable sections, so that long configuration lists stay usable.
50. As a developer, I want to create, rename, and delete workspaces in settings, so that I can manage my life contexts.
51. As a developer, I want to CRUD links in the link catalog from settings, so that I have one place to manage all bookmarks.
52. As a developer, I want to assign catalog links to edge groups per workspace from settings, so that I control what each workspace shows.
53. As a developer, I want to reorder links within each edge group in settings, so that my top 8 flyout slots reflect priority.
54. As a developer, I want to edit a workspace's full theme in settings — color palette, background image, glass/surface styling — so that each workspace has a distinct look and feel.
55. As a developer, I want to toggle canvas widgets per workspace in settings, so that I control ambient canvas content.
56. As a developer, I want to configure focus radio stations, ICS feed URLs, and keyboard shortcuts in settings.
57. As a developer, I want to export my library as a YAML snapshot from settings, so that I can back up or version my setup in git.
58. As a developer, I want to import a YAML snapshot from a URL in settings, so that I can restore or load a dotfiles-hosted config on a new machine.

### Workspaces

59. As a developer, I want multiple workspaces (e.g. Work, Personal), so that I can separate contexts.
60. As a developer, I want one workspace active at a time, so that the shell shows a single coherent context.
61. As a developer, I want each workspace to have its own theme, so that switching workspace changes the entire look and feel.
62. As a developer, I want each workspace to have its own placements (edge groups), canvas widgets, and internal tool state, so that Work and Personal show different surfaces from the same catalog.
63. As a developer, I want the link catalog shared across workspaces, so that I add a link once and place it differently per workspace.
64. As a developer, I want to switch workspaces via the command bar, control center, or Tab (when command bar is empty), so that both keyboard and mouse users can change context.
65. As a developer, I want a workspace transition animation when switching, so that context changes feel deliberate and spatial.

### Links

66. As a developer, I want each link to have a URL plus optional title and optional image, so that I control how links appear.
67. As a developer, I want links to fall back to favicon when no custom image is provided, so that links are visual without manual setup.
68. As a developer, I want links to fall back to a URL-derived title when no custom title is provided, so that links are usable immediately after paste.
69. As a developer, I want every link to open in a new tab, so that Yeti stays open as my home station.
70. As a developer, I want a flat link catalog with no folder tree, so that I avoid folder hell.
71. As a developer, I want links to exist in the catalog without being placed on any edge group, so that I can keep a large archive reachable via search only.

### Persistence & portability

72. As a developer, I want all library data stored in IndexedDB, so that my shell works offline and without a backend.
73. As a developer, I want Yeti to work identically on localhost and a hosted URL, so that I can deploy wherever I prefer.
74. As a developer, I want library snapshots as versioned YAML files, so that I can store config in a GitHub dotfiles repo.
75. As a developer, I want theme background images referenced by URL in snapshots, not embedded, so that snapshot files stay small and git-friendly.
76. As a developer, I want snapshot import to replace the library predictably, so that I understand what happens when I load a URL.
77. As a developer, I want start page tabs to reflect library changes from a pinned home station tab without reload, so that new-tab search stays current.

### First run

78. As a developer, I want an opinionated starter template on first `/home` visit, so that Yeti feels alive and demonstrates the shell immediately.
79. As a developer, I want pre-built Work and Personal workspaces with distinct themes, so that I see per-workspace theming out of the box.
80. As a developer, I want sample dev links on edge groups, so that flyout interactions are discoverable.
81. As a developer, I want to remove or replace all starter content via settings, so that the template is not a cage.

### Keyboard

82. As a developer, I want configurable keyboard shortcuts with browser-safe defaults, so that shortcuts work without fighting Chrome.
83. As a developer, I want shortcuts to work only when a Yeti tab is active, so that behavior matches the no-extension delivery model.
84. As a developer, I want a default shortcut to focus the command bar (e.g. ⌘⇧K), so that keyboard-first workflow works immediately.

## Implementation Decisions

### Tech stack

- **Next.js** (App Router), **TypeScript**, **Tailwind CSS**
- **Framer Motion** for spring-based panel and transition animations
- **Zustand** for client UI state (launcher, shell animation, config dialog)
- **TanStack Query** for async reads/writes against IndexedDB (cache + optimistic updates)
- **IndexedDB** via `idb`

### Major modules

The implementation favors **deep modules** — simple interfaces, substantial internals, testable in isolation.

| Module | Responsibility |
|--------|----------------|
| **Library** | Full aggregate: catalog, workspaces, themes, placements, shortcuts, focus radio, internal tools, canvas widgets |
| **Snapshot** | YAML serialize/deserialize, version migration, URL fetch import |
| **Search** | Fuzzy search, workspace-first ranking, catalog fallback |
| **Placement** | Edge groups, fractional order, launcher scope |
| **Link display** | Title/image fallback (favicon, URL-derived title) |
| **Theme** | Workspace theme → CSS custom properties; palette extraction from background |
| **Internal tools** | Pomodoro (splits, countdown mode), focus tasks |
| **Focus radio** | BYO stations, playback state, stream proxy |
| **Canvas widgets** | Per-workspace toggles, widget-specific display logic |
| **Shell frame** | Rim geometry, notch animation, zone activation |
| **Starter template** | Seeds library on first run |

### State management split

- **Zustand**: ephemeral UI state (which notch is open/pinned, launcher open, config dialog section)
- **TanStack Query + Library module**: persisted library data, mutations with optimistic updates and IndexedDB write-through

### Interaction specifics

| Interaction | Behavior |
|-------------|----------|
| Edge flyout | Hover open, pointer leave close; click handle to pin until dismiss |
| Edge flyout content | Max 8 links, then "see more" → launcher filtered to that edge group |
| Command bar | Bottom rim notch; fuzzy search + `:` actions |
| Control center | Top rim notch; workspaces, calendar, media tabs |
| Internal tools | Right rim handles; pomodoro and tasks flyouts |
| Settings | Centered dialog via `:settings` or top-right control |
| Canvas | Widget stack only; links via edges, command bar, launcher |
| Link click | Always `target="_blank"` |
| Workspace switch | Command bar, control center, Tab (empty query), workspace transition animation |

### Data flow

1. App boot → Library module loads from IndexedDB (or seeds starter template on first `/home` visit)
2. Active workspace theme applied to shell root
3. Placement module resolves edge groups for active workspace
4. User mutations → Library patch → IndexedDB persist → TanStack Query invalidate
5. Export → Snapshot module serializes to YAML; Import → deserialize → validate → replace library

## Testing Decisions

Test **observable behavior** through module public interfaces — not React component internals.

| Module | Priority |
|--------|----------|
| **Snapshot** | High — YAML round-trip, version field, legacy pin stripping |
| **Search** | High — workspace-first ranking, fuzzy match |
| **Placement** | High — edge truncation (8), per-workspace isolation |
| **Library** | High — invariant enforcement, patch application |
| **Internal tools** | High — pomodoro phases, countdown mode, task ordering |
| **Canvas widgets** | Medium — visibility rules, dismiss semantics |
| **Link display** | Medium — title/image fallback |
| **Theme** | Low — token → CSS variable mapping |

Vitest. IndexedDB in tests via in-memory store adapter.

## Out of Scope

- Browser extension or PWA delivery
- Canvas pin strip or freeform pin placement (removed from v1 — see issue 48)
- Canvas workspace switcher (workspace switch via command bar, control center, Tab)
- Right-rim settings hover panel (settings are a dialog — see issue 26)
- URL-encoded start page payloads (library lives in IndexedDB — see ADR 0004)
- Link folder hierarchy (projects, collections, trees)
- Live sync or multi-device automatic sync
- Multi-user or team workspaces
- GitHub API integration
- Server-backed storage or authentication
- Bundled focus radio station catalog (BYO only)
- Weather, OAuth calendar

## Further Notes

- `CONTEXT.md` is the domain glossary; `docs/adr/` records architectural decisions.
- ADR 0001 governs persistence; ADR 0004 governs the two-surface model.
- Visual direction: Hyprland/Quickshell rice aesthetic — soft warm off-whites, glassmorphism, large radii, spring motion.
- GitHub remote may still be named `quickshell-start`; product name is **Yeti**.
