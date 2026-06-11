Status: ready-for-agent

## Parent

`.scratch/yeti-v2/PRD.md`

## What to build

Implement **library snapshot** `version: 2` import per ADR 0009. v2 workspaces carry `bookmarks` — named groups with inline link rows (`name` for group handle label, `icon` optional, `links[]` with `url` and optional `title`/`image`). Array order becomes fractional order keys and generated link IDs on import. v1 import unchanged.

Tracer bullet: parse v2 YAML, produce a valid runtime **library** in IndexedDB, covered by Snapshot module tests.

Example v2 fragment:

```yaml
version: 2
workspaces:
  - name: Work
    theme: { ... }
    bookmarks:
      - name: Today
        icon: "☀️"
        links:
          - title: GitHub
            url: https://github.com
          - url: https://linear.app
```

## Acceptance criteria

- [ ] `deserializeSnapshot` accepts `version: 2` and returns a **library** matching inline bookmark data
- [ ] Link IDs generated on import; duplicate URLs in YAML create distinct catalog entries if needed
- [ ] Group and link order follow YAML array order (mapped to fractional keys internally)
- [ ] v1 snapshots still import without regression
- [ ] Unit tests cover v2 parse, v1 compatibility, and order mapping

## Blocked by

None — can start immediately
