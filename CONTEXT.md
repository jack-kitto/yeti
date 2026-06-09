# Yeti

A developer-focused productivity shell for developers — spatial navigation, edge-attached panels, and a central workspace canvas. Delivered as a web app (local or hosted). Yeti has two distinct surfaces: a **home station** you pin and work from all day, and a lightweight **start page** you set as the browser new-tab URL for instant search-and-launch.

**Two surfaces:** the **home station** (`/home`) is the full **shell** — pin it and keep it open. The **start page** (`/start`) is a lightweight new-tab surface that reads the same **library** from IndexedDB; bookmark `/start` in the browser. Open `/home` once first so the library seeds; after that, new tabs are near-instant (issue 34).

## Language

**Yeti**:
The product — a productivity shell for developers combining bookmarks, projects, docs, GitHub access, and quick actions in a spatial UI.
_Avoid_: Dashboard, homepage, portal, Quickshell

**Shell**:
The overall spatial interface metaphor — controls on screen edges, canvas in the center, contextual flyouts rather than traditional web chrome.
_Avoid_: Dashboard, layout, UI

**Library**:
A single user's complete Yeti dataset — workspaces, the link catalog, placements, themes, and preferences. Persisted in browser **IndexedDB** on the active machine/browser.
_Avoid_: Config, database, state

**Library snapshot**:
A portable export of the entire library as a versioned **YAML** file, loadable from a URL (e.g. a raw file in a GitHub repo) for backup or cross-machine restore. Theme background images are referenced by URL, not embedded. Not live sync — a manual or on-load pull.
_Avoid_: Sync, backup file, settings export

**Link**:
A single bookmark — URL plus optional title and optional image. Display uses whatever is provided: custom image, else favicon; custom title, else derived from URL. Opens in a **new tab** always. The atomic unit of the library.
_Avoid_: Resource, bookmark, item, entry

## Organization

Yeti has **no link tree** — no projects, folders, or nested collections. Links live in a flat catalog and are organized spatially (**edge groups**) within a **workspace**.

**Workspace**:
A named shell context (e.g. Work, Personal). One workspace is active at a time. Each workspace has its own theme and its own **edge** placements; the link catalog is shared globally. Switch via the **command bar** (workspace rows + fuzzy match), the **control center** workspaces tab, or **Tab** when the command bar is empty (cycles workspaces; with a query, Tab cycles results instead). Each switch uses a **workspace transition**: the canvas plane (widgets + theme) scrolls horizontally while rims stay fixed; the shell **expands** toward the screen edges until the canvas is fully hidden, the workspace changes, then the shell **contracts** back to normal rim size. Not a canvas switcher control.
_Avoid_: Profile, project, environment

**Theme**:
The visual identity of a workspace — color palette, background image, glass/surface styling, and related look-and-feel settings. Each workspace has its own theme. By default, palette colors are **extracted** from the background image (via client-side color extraction, e.g. [extract-colors](https://github.com/Namide/extract-colors)); the user can override any token manually in **settings**.
_Avoid_: Skin, appearance preset

**Workspace transition**:
The motion when changing active **workspace**. The canvas plane (widgets + **theme**) moves horizontally; rim frames stay anchored. The shell expands outward until it fills the screen and hides the canvas, the workspace swaps underneath, then the shell contracts back to its resting rim size.
_Avoid_: Page transition, slide animation

## Shell layout

**Canvas**:
The large central area and primary focus surface. In v1: **canvas widgets** only — ambient home content with no pins and no workspace switcher. Enabled widgets stack vertically at optical center with a slight upward bias (~40% from top). Links are reached via **edge groups**, the **command bar**, and the **launcher**.
_Avoid_: Dashboard, homepage, main content, pin strip

**Canvas widget**:
A small configurable block on the **canvas** — always visible when enabled. v1 types: clock/date, welcome message, and **quote**. On/off toggles are **per-workspace** (stored on the workspace record); configured from **settings**. Ambient and minimal; not duplicated in the **control center**.
_Avoid_: Widget, tile, card

**Quote**:
A **canvas widget** that rotates short lines curated for design, innovation, engineering, coding, and productivity — including sharp, funny **grug-brained developer** takes that still land. Static bundled list in v1; no external API.
_Avoid_: Affirmation, fortune cookie, API feed

**Control center**:
The **top rim** pocket — on-demand glance and utility content opened by hovering the top edge. Tabbed inside the pocket; configured from **settings**. v1 tabs: **workspaces** (switch and glance at active context), **calendar** (per-workspace **ICS feed URL** in settings — read-only, no OAuth in v1). Shows **next up**: timed events from now forward; all-day events for today until midnight. Click title opens event URL when present; expand shows details inline. List capped at **5** events with **+N more** when overflow. No ICS URL → setup prompt linking to **settings**, and **media**. The **media** tab always exposes the built-in **focus radio** player (lofi, chill hop, techno-style stations); when the browser's media session reports now-playing elsewhere, that overlays as a glance/control strip — radio remains reachable without dismissing it. Does not host **canvas widgets**, **tasks**, or other **internal tools** — tasks live on the **right rim**, not here. Weather is out of v1 scope.
_Avoid_: Dashboard, top panel, notification center

**Focus radio**:
The stream player in the **control center** media tab — **bring-your-own (BYO)** stations only. The user adds personal **stream** URLs (Icecast/MP3) or **youtube** live links in **settings** for their own instance; Yeti does not ship a bundled station catalog (third-party embed licensing). Each saved station has a user label, URL, and kind (`stream` | `youtube`). **Global** preference: user's station list, last station, volume, and playing/paused state persist in the **library**. Media tab: searchable picker over the user's stations; optional user-provided image URL per station (no bundled broadcaster logos). v1 controls: station picker, play/pause, volume, mute. On `stream` failure: retry once, then try next user station; error if all fail. Playback continues when the control center pocket closes. **Media session** glance strip above BYO radio when another tab is playing; external playback auto-pauses focus radio.
_Avoid_: Spotify embed, bundled radio catalog

**Edge**:
The **left rim** — hosts **multiple edge groups** of catalog links, each with its own **edge handle** and **edge flyout**. The top and bottom rims host the **control center** and **command bar** pockets instead.
_Avoid_: Menu, panel, zone

**Right rim**:
The right screen edge — hosts **internal tools** (pomodoro, tasks in v1), each with its own **edge handle** and tool flyout. Mirrors the left rim's handle/flyout/fractional-order model; v1 uses a fixed tool order (rim drag-reorder deferred).
_Avoid_: Config panel, settings edge, widget dock

**Internal tool**:
A built-in shell app on the **right rim** — not a catalog **link** and not an **edge group**. v1: pomodoro timer and task list. Each tool is a first-class record in the **library** (handle order, tool-specific state) parallel to link placements, not a link kind or edge-group reuse. Tool state is **per-workspace** — tasks and pomodoro timer each have independent state in Work vs Personal.
_Avoid_: Widget, extension, plugin, edge group

**Focus split**:
A pomodoro timing preset — work interval, short break, and long break. v1 ships multiple built-in splits plus a **custom split** the user defines. Selected per workspace; stored in the **library**. An active timer persists across reload via a saved end timestamp; optional chime on session end (off by default).
_Avoid_: Timer preset, interval set

**Focus task**:
A lightweight item on the dev focus list — title plus optional time estimate (minutes). Per-workspace, **local-only**, ordered via **fractional order**. Tasks persist in a workspace backlog; each can be marked **today** — the tasks flyout defaults to today's subset. **Start focus** on a task sets it as active and starts a work-interval pomodoro; the timer flyout shows the active task name. Complete from either flyout. Not a full project-management backlog.
_Avoid_: Todo, ticket, issue tracker

**Edge group**:
A user-named cluster of catalog links attached to one **edge** at a specific slot along the rim. Each group has a user-chosen name and handle icon, and opens its own contextual flyout on hover. Groups on the same edge are independent — different names, icons, link lists, and flyout anchors.
_Avoid_: Folder, category, menu

**Fractional order**:
How Yeti stores any user-ordered sequence — **edge groups** on a rim, links within an **edge group**, **focus tasks**, and any other ordered placement. Each item carries a fractional index key; inserting or reordering assigns a new key between neighbors without renumbering the whole list.
_Avoid_: Sort order, array index, z-index

**Edge order**:
The **fractional order** of **edge groups** along one **edge**. Dropping a handle onto an occupied position inserts it there: neighbors shift visually and the moved group gets a new key between its new neighbors.
_Avoid_: Slot index, position number

**Edge slot**:
A visual resting position along an **edge**, computed from viewport size and minimum handle spacing. Slots are rendering targets for snap-on-release; persistence uses **edge order** (fractional indices), not slot integers.
_Avoid_: Grid cell, coordinate, array index

**Edge handle**:
The visible icon on a rim that represents one **edge group** (left) or **internal tool** (right). Link-group handles are user-assigned: optional custom image URL, else emoji or short text glyph, else initials from the group name. Tool handles use built-in icons in v1. Hovering opens the flyout from the handle's anchor with shell-deformation motion. Click to pin the flyout open until dismissed.
_Avoid_: Button, tab, dock item

**Edge flyout**:
The contextual panel of links for one **edge group**. Opens from the group's **edge handle** anchor (not the center of the screen edge). Shows up to **8 links** (user-ordered), then **see more** opens the **launcher** filtered to that group. Closes when the pointer leaves unless pinned.
_Avoid_: Sidebar, dropdown, popover

**Edge groups** on the left rim and **internal tools** on the **right rim** share the same handle/flyout interaction model. Link-group handles use the glass **shell-icon-btn** surface; **internal tool** handles on the narrow right rim use a ghost variant (glyph only, no card) to avoid canvas overflow. Left handle slot assignment is editable on the live shell (drag handle, snap to slot) and in **settings** (slot rail for precise layout).

**Placement**:
Where a catalog link surfaces within a workspace — in one or more **edge groups**, or unplaced. Placements are per-workspace; the same catalog link can be placed differently in Work vs Personal. Ordered placements use **fractional order**.
_Avoid_: Assignment, location, slot, pin

**Link catalog**:
The master list of every link in the library — no folders or nesting. **Edge groups** and the **command bar** draw from the catalog; a link can sit in the catalog without appearing on any edge.
_Avoid_: Database, bookmark list, library table

**Launcher**:
A full-screen or large overlay for browsing links — grid with search/filter, opened via "see more" from a truncated preview. Defaults to the active workspace; can toggle to the full catalog. Feels like an OS app launcher, not a settings page.
_Avoid_: Modal, drawer, bookmark manager

**Command bar**:
A compact search input in the **bottom rim** pocket — the universal input for keyboard-first jump-to-link, workspace switching, and shell actions. **Type-to-focus**: printable keys on the focused Yeti tab open/focus the command bar and insert the character, unless focus is already in a text field (settings, tool flyouts, etc.). Two modes only: **default** (bare text) fuzzy-finds workspace switches first, then links (placed first, catalog fallback); **action mode** (`:` prefix) matches **command bar actions** only. `↑`/`↓` and `Tab`/`Shift+Tab` move selection — not `j`/`k`, which type into the query. `Enter` executes; `Esc` clears or dismisses. No preview pane.
_Avoid_: Search box, omnibox, palette

**Command bar action**:
A shell operation triggered from the **command bar** with a `:` prefix — not a link. Typing `:reset` surfaces matching actions; `Enter` runs the selected action (with confirmation when destructive). Does not open a URL.
_Avoid_: Command, palette action, slash command

**Home station**:
The full Yeti experience — **shell** rims, **canvas**, **edge groups**, **internal tools**, **settings**, and the complete **library** in IndexedDB. Lives at `/home` (dedicated app route, not `/`). Intended as a pinned tab you work from all day; cold open may show a loading gate while the library loads.
_Avoid_: Main app, dashboard, root URL

**Landing page**:
The public entry at `/` — product name, one-liner, and a primary path into the **home station** (`/home`). v1 is minimal. Not a **start page** and not the **shell**.
_Avoid_: Homepage, marketing site, start page, setup wizard

**Start page**:
A lightweight surface at `/start` for browser new-tab use — **command bar** fuzzy search over the **link catalog**, with the active **workspace** **theme** as backdrop. Reads the **library** from IndexedDB (same store as **home station**). On load: generic loading state while IndexedDB is checked; if a **library** exists, search uses it immediately; if none, show **starter template** defaults and prompt the user to load their config (open **home station** or import a **library snapshot**). Search-and-launch only — no **command bar actions**, workspace switching, or **shell** chrome. SSR ships command bar HTML on first response; client attaches catalog when IDB resolves. Command bar autofocus on load. Footer link to `/home`.
_Avoid_: Bootstrap mode, encoded URL, lite shell

**Start page URL**:
The fixed browser new-tab bookmark: `/start`. No generation step, no encoded theme or links — the **library** in IndexedDB is the source of truth. Settings shows copy-to-clipboard for this path.
_Avoid_: Generated path, payload, `/p/…` route

Keyboard shortcuts are **configurable** with browser-safe defaults (e.g. `⌘⇧K` for command bar). All shortcuts are tab-scoped — they only work when the Yeti tab is active.

**Settings**:
A modal dialog for all configuration — workspace management, theme editing, link catalog CRUD, placement assignment, edge ordering, **canvas widget** toggles, **control center** options, library snapshot import/export, and destructive **library reset**. Opened via the **command bar action** `:settings` or a ghost control in the **top-right corner**. Not a rim pocket; the **right rim** is reserved for **internal tools**.
_Avoid_: Config panel, preferences page, right-edge flyout

**Library reset**:
Wipes the local **library** in IndexedDB and re-seeds the **starter template**. Available from **settings** and as a **command bar action** (`:reset`). Always requires confirmation — irreversible without a snapshot backup. Schema changes before v1 do not auto-migrate; reset (or snapshot re-import) is the upgrade path.
_Avoid_: Factory reset, clear cache, re-seed

## Example dialogue

> **Dev:** I want Railway in my Work workspace but not Personal.  
> **Expert:** Add Railway once to the catalog, place it on Work's left **edge groups**. Skip Personal placements — it won't appear there unless you search via the **command bar** catalog fallback.  
>  
> **Dev:** Can the same link be in two edge groups?  
> **Expert:** Yes. Placements are independent per **edge group** within a workspace. One catalog entry, multiple surfaces.  
>  
> **Dev:** I want two icons on the left edge — dev tools and docs.  
> **Expert:** Two **edge groups** on the left edge, each with its own **edge handle** and flyout anchor. Same link can appear in both groups if you place it twice.  
>  
> **Dev:** How do I switch to Personal?  
> **Expert:** Type in the **command bar**, use a **keyboard shortcut**, or open the **control center** workspaces tab — no switcher on the canvas.

## v1 exclusions

Plugin system deferred — build core shell first; keep internal modules clean for future extension.

Canvas **pins** and **pin strip** removed — links surface via **edge groups**, **command bar**, and **launcher** only.

**Agent host** (backlog, issue 29) — Yeti as a front door to the user's agent via **pluggable runtime adapters** (local-first; user-supplied keys for cloud). Focus planning/coaching, skill dispatch (`grill-with-docs`, `teach-me`, etc.), library snapshot push to GitHub, reminders/notifications. Command bar for quick dispatch; right-rim tool for multi-turn. Not v1; requires trust-boundary ADR before build.

Third-party radio (SomaFM, Techno.FM, etc.) is **not bundled** — **focus radio** is BYO stream/YouTube URLs for the user's personal instance. Starter template ships with an empty station list. Stations load from the **library** (snapshot import or settings CRUD) only — no local file seeding.

## First run

Yeti ships with an **opinionated starter template** (Omarchy-style) — tasteful defaults, not a blank slate. Pre-built **Work** and **Personal** workspaces with distinct themes (warm/minimal vs dark/relaxed), ~6–8 sample dev links per workspace on the left **edge**. Obvious placeholders users replace via config. Everything removable.

## Repo and package names

The GitHub repo may remain `quickshell-start` until hosting is renamed; the npm `package.json` name is `yeti`. Product-facing strings and IndexedDB use **Yeti** / `yeti`.
