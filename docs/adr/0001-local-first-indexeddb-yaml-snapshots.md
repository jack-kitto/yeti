# Local-first persistence with IndexedDB and YAML snapshots

Yeti is a personal single-user shell delivered as a web app (localhost or hosted URL). All library data — catalog, workspaces, themes, edge placements, shortcuts, focus radio, internal tools, canvas widgets — lives in browser IndexedDB on the active machine. Cross-machine portability is manual: export or import a versioned YAML snapshot from a URL (e.g. a dotfiles repo). This is not live sync.

**Canvas pin placements** were removed from v1 (issues 32, 48). Legacy snapshots may still contain `placements.pins`; import strips them on load. The active v1 library surface is edge groups only — links reach the canvas via edge flyouts, command bar, and launcher, not pinned on canvas.

We chose IndexedDB over a server database because there is no multi-user or multi-device sync requirement in v1, and the product must work identically whether self-hosted or run locally. YAML over JSON because snapshots are intended for human-editable dotfiles repos. Theme background images are URL references, not embedded blobs.

**Considered:** Server-backed storage with auth (rejected — scope creep for a personal shell). JSON snapshots (rejected — YAML preferred for dotfiles ergonomics). Browser extension for true sync (rejected — scope creep). A minimal extension for new-tab setup only is accepted separately (ADR 0010). Human-editable snapshot v2 shape is ADR 0009.
