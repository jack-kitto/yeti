# Quickshell v1 — Product Requirements Document

Status: ready-for-agent

## Problem Statement

Developers juggle dozens or hundreds of links, tools, and contexts across work and personal life. Traditional browser start pages and bookmark managers feel like cluttered websites — sidebars, dashboards, folder hierarchies — not a calm place to work from.

Developers who rice their Linux desktops (Hyprland, Quickshell) get a spatial shell: controls on screen edges, a large central canvas, contextual flyouts, and keyboard-first workflows. Nothing like that exists as a browser homepage they can open on any machine without installing a browser extension.

Quickshell solves this: a personal, local-first browser shell that feels like a lightweight operating system — edge-attached link menus, a central canvas with command bar and pins, workspace-scoped themes and layouts, and a master link catalog — delivered as a web app (localhost or hosted URL).

## Solution

Quickshell is a developer-focused browser start page. The user sets it as their homepage or bookmark. On open:

- The **canvas** shows a **command bar** (keyboard-first jump-to-link), a **workspace switcher**, and a **pin strip** with freeform pin placement.
- **Left, top, and bottom edges** each expose a **link group** — hover to open a contextual flyout (up to 8 links, then "see more" → **launcher**). Click the edge handle to pin the flyout open.
- The **right edge** opens a **config panel** on hover — workspace management, theme editing, link catalog CRUD, placement assignment, edge ordering, snapshot import/export.
- A shared **link catalog** holds all links. **Workspaces** partition theme and **placements** (which links appear on which edges and pins). Search is workspace-first with full-catalog fallback.
- All data persists in **IndexedDB**. Portability via versioned **YAML library snapshots** (import/export, load from URL).

First run ships an opinionated **starter template** (Omarchy-style): Work and Personal workspaces, distinct themes, sample dev links on all edges and the pin strip.

## User Stories

### Shell & layout

1. As a developer, I want Quickshell to open as my browser homepage, so that every new browsing session starts from my shell.
2. As a developer, I want the interface to feel spatial and OS-like — edge panels, central canvas, minimal chrome — so that it does not feel like a traditional website dashboard.
3. As a developer, I want a large central canvas as my primary focus area, so that I spend most of my time there rather than in chrome.
4. As a developer, I want soft warm visuals with glassmorphism, large radii, and gentle motion, so that the shell feels polished and calm.
5. As a developer, I want spring-based panel animations, so that flyouts and transitions feel physical and responsive.
6. As a developer, I want no traditional sidebar, top navbar, or widget dashboard, so that the shell stays spatial and uncluttered.

### Canvas

7. As a developer, I want a command bar on the canvas, so that I can keyboard-first jump to any link.
8. As a developer, I want the command bar to search my active workspace's placed links first, so that daily links surface immediately.
9. As a developer, I want the command bar to fall back to the full link catalog when no workspace match exists, so that I can still reach unplaced links without switching workspace.
10. As a developer, I want fuzzy matching in the command bar, so that I can find links without typing exact titles.
11. As a developer, I want a workspace switcher on the canvas, so that I can change context with one click.
12. As a developer, I want a horizontal pin strip below the command bar, so that my most-used links are always visible on the canvas.
13. As a developer, I want to drag a pin out of the strip to place it freeform on the canvas, so that I can arrange my canvas spatially.
14. As a developer, I want to drag a freeform pin back to the strip to re-dock it, so that I can reset layout easily.
15. As a developer, I want only one pin per link per workspace, so that the canvas does not duplicate entries.
16. As a developer, I want new pins to land in the pin strip by default, so that layout starts organized.

### Edge menus

17. As a developer, I want three edge positions (left, top, bottom) identified by position only, so that I build muscle memory without naming edges.
18. As a developer, I want each edge to hold a group of links — not a single link — so that edges are contextual menus.
19. As a developer, I want hovering an edge to open its flyout, so that I can access links quickly without clicking.
20. As a developer, I want the flyout to close when my pointer leaves, so that the shell stays clean.
21. As a developer, I want to click an edge handle to pin its flyout open, so that I can browse links without holding hover.
22. As a developer, I want each flyout to show up to 8 links in my chosen order, so that flyouts stay scannable.
23. As a developer, I want a "see more" action when an edge group has more than 8 links, so that I can access the full group without a cramped flyout.
24. As a developer, I want the same link to appear on multiple edges within a workspace, so that I can surface important links in more than one context.
25. As a developer, I want left, top, and bottom edges to behave identically, so that the interaction model is consistent.

### Launcher

26. As a developer, I want a launcher overlay that feels like an OS app launcher, so that browsing many links is visual and comfortable.
27. As a developer, I want to open the launcher via "see more" from an edge flyout, so that edge groups scale beyond 8 links.
28. As a developer, I want the launcher to default to my active workspace's links, so that browsing stays context-aware.
29. As a developer, I want to toggle the launcher to show the full link catalog, so that I can browse everything when needed.
30. As a developer, I want search/filter inside the launcher, so that I can find links in a large catalog.
31. As a developer, I want the launcher to be separate from the command bar, so that jump-to and browse are distinct workflows.

### Config panel

32. As a developer, I want to open config by hovering anywhere on the right edge, so that settings are always accessible without leaving the shell.
33. As a developer, I want the config panel height to follow its content up to the full edge height, so that short settings stay compact and long lists use available space.
34. As a developer, I want the config panel to scroll internally when content overflows, so that I never lose access to options.
35. As a developer, I want to create, rename, and delete workspaces in config, so that I can manage my life contexts.
36. As a developer, I want to CRUD links in the link catalog from config, so that I have one place to manage all bookmarks.
37. As a developer, I want to assign catalog links to edges and pins per workspace from config, so that I control what each workspace shows.
38. As a developer, I want to reorder links within each edge group in config, so that my top 8 flyout slots reflect priority.
39. As a developer, I want to edit a workspace's full theme in config — color palette, background image, glass/surface styling — so that each workspace has a distinct look and feel.
40. As a developer, I want to export my library as a YAML snapshot from config, so that I can back up or version my setup in git.
41. As a developer, I want to import a YAML snapshot from a URL in config, so that I can restore or load a dotfiles-hosted config on a new machine.
42. As a developer, I want to configure keyboard shortcuts in config, so that I can avoid browser conflicts.

### Workspaces

43. As a developer, I want multiple workspaces (e.g. Work, Personal), so that I can separate contexts.
44. As a developer, I want one workspace active at a time, so that the shell shows a single coherent context.
45. As a developer, I want each workspace to have its own theme, so that switching workspace changes the entire look and feel.
46. As a developer, I want each workspace to have its own placements (edges and pins), so that Work and Personal show different link surfaces from the same catalog.
47. As a developer, I want the link catalog shared across workspaces, so that I add a link once and place it differently per workspace.
48. As a developer, I want to switch workspaces via the canvas switcher, so that mouse users can change context quickly.
49. As a developer, I want to switch workspaces via the command bar (Raycast-style), so that keyboard users can jump to a workspace by name.
50. As a developer, I want to tab through workspaces via a configurable hotkey, so that I can cycle contexts without the mouse.

### Links

51. As a developer, I want each link to have a URL plus optional title and optional image, so that I control how links appear.
52. As a developer, I want links to fall back to favicon when no custom image is provided, so that links are visual without manual setup.
53. As a developer, I want links to fall back to a URL-derived title when no custom title is provided, so that links are usable immediately after paste.
54. As a developer, I want every link to open in a new tab, so that Quickshell stays open as my homepage.
55. As a developer, I want a flat link catalog with no folder tree, so that I avoid folder hell.
56. As a developer, I want links to exist in the catalog without being placed on any edge or pin, so that I can keep a large archive reachable via search only.

### Persistence & portability

57. As a developer, I want all library data stored in IndexedDB, so that my shell works offline and without a backend.
58. As a developer, I want Quickshell to work identically on localhost and a hosted URL, so that I can deploy wherever I prefer.
59. As a developer, I want library snapshots as versioned YAML files, so that I can store config in a GitHub dotfiles repo.
60. As a developer, I want theme background images referenced by URL in snapshots, not embedded, so that snapshot files stay small and git-friendly.
61. As a developer, I want snapshot import to replace or merge predictably, so that I understand what happens when I load a URL.

### First run

62. As a developer, I want an opinionated starter template on first open, so that Quickshell feels alive and demonstrates the shell immediately (Omarchy-style).
63. As a developer, I want pre-built Work and Personal workspaces with distinct themes, so that I see per-workspace theming out of the box.
64. As a developer, I want ~6–8 sample dev links per workspace on all edges and the pin strip, so that flyout and pin interactions are discoverable.
65. As a developer, I want to remove or replace all starter content via config, so that the template is not a cage.

### Keyboard

66. As a developer, I want configurable keyboard shortcuts with browser-safe defaults, so that shortcuts work without fighting Chrome.
67. As a developer, I want shortcuts to work only when the Quickshell tab is active, so that behavior matches the no-extension delivery model.
68. As a developer, I want a default shortcut to focus the command bar (e.g. ⌘⇧K), so that keyboard-first workflow works immediately.

## Implementation Decisions

### Tech stack

- **Next.js** (App Router), **TypeScript**, **Tailwind CSS**, **shadcn/ui** for base components
- **Framer Motion** for spring-based panel and transition animations
- **Zustand** for client UI state (active workspace, open flyouts, launcher visibility, drag state)
- **TanStack Query** for async reads/writes against IndexedDB (cache + optimistic updates)
- **IndexedDB** via a thin persistence adapter (e.g. `idb` or Dexie)

### Major modules

The implementation should favor **deep modules** — simple interfaces, substantial internals, testable in isolation.

#### 1. Library (domain + persistence)

Encapsulates the entire **library** aggregate: link catalog, workspaces, themes, placements, pin positions, shortcut bindings, active workspace id.

- Single interface: `getLibrary()`, `saveLibrary(library)`, `applyPatch(patch)`
- IndexedDB is an implementation detail behind this module
- Validates invariants: one pin per link per workspace, placement references valid catalog ids, workspace theme always present

#### 2. Snapshot

Handles **library snapshot** serialize/deserialize, version migration, and URL fetch import.

```yaml
version: 1
catalog:
  - id: ...
    url: ...
    title: ...        # optional
    image: ...        # optional
workspaces:
  - id: ...
    name: ...
    theme: { palette, backgroundUrl, ... }
    placements:
      edges: { left: [linkIds], top: [...], bottom: [...] }
      pins: [{ linkId, position: strip | { x, y } }]
shortcuts: ...
activeWorkspaceId: ...
```

- Round-trip fidelity is a core contract
- Background images are URL references only (per ADR-0001)

#### 3. Search

Fuzzy search over links with workspace-first, catalog-fallback ranking.

- Input: query, active workspace, library
- Output: ranked results with source hint (placed in workspace vs catalog-only)
- Used by command bar and launcher filter

#### 4. Placement

Resolves what links appear where for a given workspace.

- Edge groups (ordered, truncated to 8 for flyout)
- Pins (strip order + freeform coordinates)
- Launcher filters (workspace scope vs full catalog; edge-group scope for "see more")

#### 5. Link display

Resolves display title and image for a link.

- Custom title/image if provided; else favicon fetch + URL-derived title
- Favicon caching strategy (in-memory + IndexedDB cache, respect failures gracefully)

#### 6. Theme

Applies a workspace **theme** to CSS custom properties on the shell root.

- Palette tokens, background image, glass opacity, border radii, shadow presets
- No runtime theme engine beyond token → CSS variable mapping in v1

#### 7. Shortcuts

Registers configurable, tab-scoped keyboard bindings.

- Default bindings avoid browser conflicts
- Actions: focus command bar, cycle workspace, switch workspace by name (via command bar integration)

#### 8. Starter template

Seeds the library on first run when IndexedDB is empty.

- Work + Personal workspaces, distinct themes, sample dev links, placements on all edges and pin strip

#### 9. Shell UI (presentation)

Composes the shell from smaller presentational components. Should remain thin — delegates to modules above.

- `Shell` — layout grid, edge hit zones, theme provider
- `Canvas` — command bar, workspace switcher, pin strip, freeform pin layer
- `EdgeMenu` — hover/pin flyout behavior (shared across left/top/bottom)
- `ConfigPanel` — right-edge hover panel, sections for catalog, placements, themes, workspaces, snapshots, shortcuts
- `Launcher` — overlay grid + filter toggle
- `CommandBar` — fuzzy jump-to, workspace switch commands

### State management split

- **Zustand**: ephemeral UI state (which flyout is open/pinned, launcher open, drag in progress, config panel hover)
- **TanStack Query + Library module**: persisted library data, mutations with optimistic updates and IndexedDB write-through

### Interaction specifics

| Interaction | Behavior |
|-------------|----------|
| Edge flyout | Hover open, pointer leave close; click handle to pin until dismiss |
| Edge flyout content | Max 8 links, then "see more" → launcher filtered to that edge's group |
| Config panel | Hover anywhere on right edge; auto height to full edge; internal scroll |
| Pin strip | Default pin home; drag out = freeform `{x,y}`; drag back = strip |
| Link click | Always `target="_blank"` |
| Workspace search | Placed links ranked first; unplaced catalog links below |

### Data flow

1. App boot → Library module loads from IndexedDB (or seeds starter template)
2. Active workspace theme applied to shell root
3. Placement module resolves edges/pins for active workspace
4. User mutations → Library patch → IndexedDB persist → TanStack Query invalidate
5. Export → Snapshot module serializes to YAML; Import → deserialize → validate → replace library

## Testing Decisions

### What makes a good test

Test **observable behavior** through module public interfaces — not React component internals or IndexedDB schema details.

- Given a library state and user action, assert outputs (search results, placement resolution, snapshot round-trip, display fallbacks)
- UI tests only for critical shell interactions if e2e harness is set up; prioritize deep module unit tests

### Modules to test (recommended)

| Module | Priority | Why |
|--------|----------|-----|
| **Snapshot** | High | YAML round-trip, version field, invalid input rejection |
| **Search** | High | Workspace-first ranking, fuzzy match, catalog fallback |
| **Placement** | High | Edge truncation (8), pin strip vs freeform, per-workspace isolation |
| **Library** | High | Invariant enforcement, patch application |
| **Link display** | Medium | Title/image fallback logic (mock favicon fetch) |
| **Theme** | Low | Token → CSS variable mapping (smoke test) |
| **Shortcuts** | Low | Binding registration (defer if DOM-coupled) |

No prior art exists — greenfield repo. Use Vitest. IndexedDB in tests via `fake-indexeddb` or in-memory adapter injected into Library module.

## Out of Scope

- Browser extension or PWA delivery
- Plugin system (defer; keep modules deep for future extension)
- Link folder hierarchy (projects, collections, trees)
- Tags, saved views, cross-project references
- Live sync or multi-device automatic sync
- Multi-user or team workspaces
- GitHub API integration (activity feeds, repo metadata)
- Server-backed storage or authentication
- Kanban, knowledge graph, documentation explorer, or other canvas modes beyond command bar + pins
- Bottom-edge utility shell (tasks, timers, scratchpad) — bottom is a link edge like left/top
- Modal-heavy UX
- Per-link "open in same tab" override
- Embedded background images in snapshots

## Further Notes

- Repo is greenfield — this PRD covers the initial build from scratch.
- GitHub remote (`jack-kitto/quickshell-start`) is for source hosting; issues tracked locally in `.scratch/`.
- Visual direction: Hyprland/Quickshell rice aesthetic — soft warm off-whites, glassmorphism, large radii, spring motion. Reference Omarchy for opinionated-but-tasteful starter defaults, not for feature parity.
- `CONTEXT.md` is the domain glossary; `docs/adr/0001-local-first-indexeddb-yaml-snapshots.md` governs persistence.
- Config panel navigation structure (flat vs nested sections) can be decided during implementation — favor shallow sections: Workspaces, Links, Placements, Themes, Snapshots, Shortcuts.
