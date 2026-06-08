# Quickshell

A developer-focused browser start page that feels like a desktop shell — edge-attached panels, spatial navigation, and a central workspace canvas. Delivered as a web app (local or hosted); opened via browser homepage or bookmark.

## Language

**Quickshell**:
The product — a productivity shell for developers combining bookmarks, projects, docs, GitHub access, and quick actions in a spatial UI.
_Avoid_: Dashboard, homepage, portal

**Shell**:
The overall spatial interface metaphor — controls on screen edges, canvas in the center, contextual flyouts rather than traditional web chrome.
_Avoid_: Dashboard, layout, UI

**Library**:
A single user's complete Quickshell dataset — workspaces, the link catalog, placements, themes, and preferences. Persisted in browser **IndexedDB** on the active machine/browser.
_Avoid_: Config, database, state

**Library snapshot**:
A portable export of the entire library as a versioned **YAML** file, loadable from a URL (e.g. a raw file in a GitHub repo) for backup or cross-machine restore. Theme background images are referenced by URL, not embedded. Not live sync — a manual or on-load pull.
_Avoid_: Sync, backup file, settings export

**Link**:
A single bookmark — URL plus optional title and optional image. Display uses whatever is provided: custom image, else favicon; custom title, else derived from URL. Opens in a **new tab** always. The atomic unit of the library.
_Avoid_: Resource, bookmark, item, entry

## Organization

Quickshell has **no link tree** — no projects, folders, or nested collections. Links live in a flat catalog and are organized spatially (edge menus, pins) within a **workspace**.

**Workspace**:
A named shell context (e.g. Work, Personal). One workspace is active at a time. Each workspace has its own theme and its own placements (edges, pins); the link catalog is shared globally. Switch via a canvas control or Raycast-style hotkey (command bar action to pick a workspace, or tab through them).
_Avoid_: Profile, project, environment

**Theme**:
The visual identity of a workspace — color palette, background image, glass/surface styling, and related look-and-feel settings. Each workspace has its own theme.
_Avoid_: Skin, appearance preset

## Shell layout

**Canvas**:
The large central area. In v1: universal search (command palette) and pinned links. The user's primary focus surface.
_Avoid_: Dashboard, homepage, main content

**Edge**:
One of the three rim zones — left, top, or bottom. An edge can host **multiple edge groups**, each with its own handle icon and flyout.
_Avoid_: Menu, panel, zone

**Edge group**:
A user-named cluster of catalog links attached to one **edge** at a specific slot along the rim. Each group has a user-chosen name and handle icon, and opens its own contextual flyout on hover. Groups on the same edge are independent — different names, icons, link lists, and flyout anchors.
_Avoid_: Folder, category, menu

**Fractional order**:
How Quickshell stores any user-ordered sequence — **edge groups** on a rim, links within an **edge group**, **pin strip** position, and any other ordered placement. Each item carries a fractional index key; inserting or reordering assigns a new key between neighbors without renumbering the whole list.
_Avoid_: Sort order, array index, z-index

**Edge order**:
The **fractional order** of **edge groups** along one **edge**. Dropping a handle onto an occupied position inserts it there: neighbors shift visually and the moved group gets a new key between its new neighbors.
_Avoid_: Slot index, position number

**Edge slot**:
A visual resting position along an **edge**, computed from viewport size and minimum handle spacing. Slots are rendering targets for snap-on-release; persistence uses **edge order** (fractional indices), not slot integers.
_Avoid_: Grid cell, coordinate, array index

**Edge handle**:
The visible icon on an edge that represents one **edge group**. The handle image is user-assigned: optional custom image URL, else an emoji or short text glyph, else initials derived from the group name. Hovering the handle opens that group's flyout, emerging from the handle's anchor point on the rim with shell-deformation motion. Click the handle to pin the flyout open until dismissed.
_Avoid_: Button, tab, dock item

**Edge flyout**:
The contextual panel of links for one **edge group**. Opens from the group's **edge handle** anchor (not the center of the screen edge). Shows up to **8 links** (user-ordered), then **see more** opens the **launcher** filtered to that group. Closes when the pointer leaves unless pinned.
_Avoid_: Sidebar, dropdown, popover

Edge groups on left, top, and bottom share the same interaction model; they differ by edge position and handle placement along the rim. Handle slot assignment is editable on the live shell (drag handle, snap to slot) and in the **config panel** (slot rail for precise layout).

**Pin**:
A link surfaced on the canvas for quick access. Pins are a placement choice, not a separate entity. A pin has a position — either in the **pin strip** or **freeform** anywhere on the canvas (per workspace).
_Avoid_: Favorite, shortcut, widget

**Pin strip**:
The default home for pins — a horizontal row on the canvas below the command bar. New pins land here. Drag out to place freeform on the canvas; drag back to re-dock. One pin per link per workspace.
_Avoid_: Dock, toolbar

**Placement**:
Where a catalog link surfaces within a workspace — in one or more **edge groups**, on the canvas as a pin, or unplaced. Placements are per-workspace; the same catalog link can be placed differently in Work vs Personal. Ordered placements use **fractional order**.
_Avoid_: Assignment, location, slot

**Link catalog**:
The master list of every link in the library — no folders or nesting. Edge menus and pins draw from the catalog; a link can sit in the catalog without appearing on any edge or pin.
_Avoid_: Database, bookmark list, library table

**Launcher**:
A full-screen or large overlay for browsing links — grid with search/filter, opened via "see more" from a truncated preview. Defaults to the active workspace; can toggle to the full catalog. Feels like an OS app launcher, not a settings page.
_Avoid_: Modal, drawer, bookmark manager

**Command bar**:
A compact search input on the canvas for keyboard-first jump-to-link and shell actions. Two modes only: **default** (bare text) fuzzy-finds workspace switches first, then links (placed first, catalog fallback); **action mode** (`:` prefix) matches **command bar actions** only. Arrow keys or `j`/`k` move selection; `Enter` executes the highlighted row; `Esc` clears or dismisses. No preview pane — the list row is enough.
_Avoid_: Search box, omnibox, palette

**Command bar action**:
A shell operation triggered from the **command bar** with a `:` prefix — not a link. Typing `:reset` surfaces matching actions; `Enter` runs the selected action (with confirmation when destructive). Does not open a URL.
_Avoid_: Command, palette action, slash command

Keyboard shortcuts are **configurable** with browser-safe defaults (e.g. `⌘⇧K` for command bar). All shortcuts are tab-scoped — they only work when the Quickshell tab is active.

**Config panel**:
A flyout on the right edge, opened by hovering anywhere along the right edge. Height follows content, growing up to the full edge height; scrolls internally when content still overflows. Contains workspace management, full theme editing (palette, background image, look-and-feel), link catalog CRUD, placement assignment, edge ordering, library snapshot import/export, and destructive library operations (e.g. reset to starter template, with confirmation).
_Avoid_: Settings page, preferences modal

**Library reset**:
Wipes the local **library** in IndexedDB and re-seeds the **starter template**. Available from the **config panel** and as a **command bar action** (`:reset`). Always requires confirmation — irreversible without a snapshot backup. Schema changes before v1 do not auto-migrate; reset (or snapshot re-import) is the upgrade path.
_Avoid_: Factory reset, clear cache, re-seed

## Example dialogue

> **Dev:** I want Railway in my Work workspace but not Personal.  
> **Expert:** Add Railway once to the catalog, place it on Work's left edge and pin strip. Skip Personal placements — it won't appear there unless you search the full catalog fallback.  
>  
> **Dev:** Can the same link be on left and top edge?  
> **Expert:** Yes. Placements are independent per **edge group** within a workspace. One catalog entry, multiple surfaces.  
>  
> **Dev:** I want two icons on the left edge — dev tools and docs.  
> **Expert:** Two **edge groups** on the left edge, each with its own **edge handle** and flyout anchor. Same link can appear in both groups if you place it twice.  
>  
> **Dev:** I dragged GitHub off the pin strip.  
> **Expert:** That's freeform placement — still one pin, just not docked. Drag back to the strip to re-dock.

## v1 exclusions

Plugin system deferred — build core shell first; keep internal modules clean for future extension.

## First run

Quickshell ships with an **opinionated starter template** (Omarchy-style) — tasteful defaults, not a blank slate. Pre-built **Work** and **Personal** workspaces with distinct themes (warm/minimal vs dark/relaxed), ~6–8 sample dev links per workspace across all three edges and the pin strip. Obvious placeholders users replace via config. Everything removable.
