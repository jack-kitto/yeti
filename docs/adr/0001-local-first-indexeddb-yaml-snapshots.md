# Local-first persistence with IndexedDB and YAML snapshots

Quickshell is a personal single-user shell delivered as a web app (localhost or hosted URL). All library data — catalog, workspaces, themes, placements, pin positions, shortcuts — lives in browser IndexedDB on the active machine. Cross-machine portability is manual: export or import a versioned YAML snapshot from a URL (e.g. a dotfiles repo). This is not live sync.

We chose IndexedDB over a server database because there is no multi-user or multi-device sync requirement in v1, and the product must work identically whether self-hosted or run locally. YAML over JSON because snapshots are intended for human-editable dotfiles repos. Theme background images are URL references, not embedded blobs.

**Considered:** Server-backed storage with auth (rejected — scope creep for a personal shell). JSON snapshots (rejected — YAML preferred for dotfiles ergonomics). Browser extension for true sync (rejected — product will never be an extension).
