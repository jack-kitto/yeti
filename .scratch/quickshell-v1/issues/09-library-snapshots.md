Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Implement the **Snapshot** module and wire it into the **config panel**.

Export the full **library** as a versioned YAML **library snapshot** (background images as URL references, not embedded). Import from a pasted URL — fetch, parse, validate, and replace the current library. Import behavior: full replace (document clearly in UI).

Schema shape (from PRD):

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
      edgeGroups:
        left: [{ id, name, icon, order, linkIds: [{ id, order }] }]
        top: [...]
        bottom: [...]
      pins: [{ linkId, position: strip | { x, y }, order }]
shortcuts: ...
activeWorkspaceId: ...
```

Add Snapshot round-trip unit tests.

## Acceptance criteria

- [ ] User can export library as downloadable YAML from config
- [ ] User can import library snapshot from a URL; library is fully replaced on success
- [ ] Invalid YAML or schema version shows a clear error; library unchanged on failure
- [ ] Background images in snapshots are URL references only
- [ ] Snapshot module tests cover serialize, deserialize, and round-trip fidelity

## Blocked by

- `.scratch/quickshell-v1/issues/06-config-link-catalog.md`
- `.scratch/quickshell-v1/issues/14-edge-groups-model.md`
