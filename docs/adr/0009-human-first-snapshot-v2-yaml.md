# Human-first library snapshot format (v2 YAML)

Status: Accepted

**Library snapshot** export moves to `version: 2` YAML that humans can edit without managing IDs or fractional order keys. Each **workspace** lists **bookmarks** — named **edge group** clusters with inline link rows (`name`, `url`, optional `title`, optional `icon` or `image`). Array order in the file is display order; duplicate URLs across groups and workspaces are allowed.

Import generates internal link IDs and fractional order keys from array position. The runtime **library** model (flat **link catalog**, **edge groups** on the left **edge**, fractional order for drag-reorder per ADR 0002) is unchanged — only the portable YAML shape changes. v1 snapshots continue to import; export defaults to v2.

We rejected keeping catalog + `linkIds` references in YAML because dotfiles ergonomics was a core promise (ADR 0001) and the v1 shape effectively requires a generator script. We rejected dropping the internal catalog because deduplication and cross-surface search still benefit from a single link record at runtime.

**Considered:** JSON instead of YAML (rejected — unchanged from ADR 0001). Single flat bookmark list per workspace without groups (rejected — loses the spatial **edge group** model). `placements.edgeGroups.left/top/bottom` with empty top/bottom (rejected — only the left **edge** hosts link groups in the product).
