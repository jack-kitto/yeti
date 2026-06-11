Status: ready-for-agent

## Parent

`.scratch/yeti-v2/PRD.md`

## What to build

Add Claude/Cursor skills to the example config repo (or `yeti` repo `scripts/` docs) that help users:

1. Design **bookmark** / **edge group** layout for their workflow (interview → v2 YAML)
2. Import bookmarks from Chrome, Firefox, or Arc (read export files → v2 YAML)
3. Organize links into Work/Personal **workspaces**

Skills reference ADR 0009 shape and domain terms from `CONTEXT.md`.

## Acceptance criteria

- [ ] At least two skills published: layout authoring + browser bookmark import
- [ ] Skills output valid v2 YAML (validated against Snapshot import in docs or a small script)
- [ ] Example session documented in example repo README
- [ ] `scripts/generate-jack-yeti-config.ts` noted as legacy v1 generator or updated to emit v2

## Blocked by

- `.scratch/yeti-v2/issues/02-snapshot-v2-export.md`
