Status: done

## Parent

`.scratch/yeti-v2/PRD.md`

## Product feedback (2026-06-11, pre-demo)

- **Welcome widget** — “Good afternoon, Work” uses workspace name; should greet the user (`displayName`) or omit the name when unset.
- **Focus radio** — ship public starter template with YouTube station links (lofi / focus streams); OK to share these URLs.
- **YouTube artwork** — auto-use stream/video thumbnail when `imageUrl` is not set.

## Acceptance criteria

- [x] Welcome message uses library `displayName`, not workspace name
- [x] Starter library seeds YouTube focus radio stations
- [x] YouTube stations resolve thumbnail from video id when `imageUrl` absent
- [x] Settings canvas section exposes display name field
