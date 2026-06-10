Status: done

## Parent

`.scratch/quickshell-v1/PRD-preset-themes.md`

## What to build

Replace the fixed center-stack + tasks-corner layout with **canvas zone** placement driven by the workspace **theme**. v1 zones: `center`, `upper-center`, `lower-left`, `lower-right`, `bottom-center`. Each enabled **canvas widget** reads its `zone` and `order` from `theme.widgets`, stacks with siblings in the same zone, and renders using per-widget `text`, `textMuted`, and `textShadow` from the theme.

Remove canvas image-sampling contrast (`useCanvasTextContrast` and related modules). Widget copy must be opaque theme colours, not derived from wallpaper pixels.

## Acceptance criteria

- [x] Enabled widgets render in their configured **canvas zone** with correct in-zone stack order
- [x] All six widget types can be assigned to any v1 zone via theme data
- [x] Per-widget `text`, `textMuted`, and `textShadow` apply to primary and secondary copy
- [x] No runtime image sampling for canvas text colours
- [x] Empty zones render nothing; disabled widgets are skipped regardless of theme placement
- [x] Tests cover zone ordering/grouping logic and widget style application

## Blocked by

- `.scratch/quickshell-v1/issues/72-preset-theme-model.md`

## Comments

Tracer bullet 4 of preset-themes rework.
