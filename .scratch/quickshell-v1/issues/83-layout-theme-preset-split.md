Status: ready-for-agent

Category: enhancement

## Parent

`.scratch/quickshell-v1/PRD-preset-themes.md`

## What to build

Split bundled presets into two independent axes users can mix and match:

- **Layout preset** — **canvas widget** zone placement, in-zone order, and any layout-specific presentation (e.g. editorial four-corner stage vs default zone grid)
- **Theme preset** — colours only: `palette`, background, **shell** fill, border, per-widget text colours

Surface presets first-class in the **control center** (new tab in the top **notch** — quick apply). Bury granular overrides (per-widget colours, shell tokens, zone pickers) in **settings**.

Applying a layout preset must not wipe theme colours; applying a theme preset must not move widgets. Track `appliedLayoutPresetId` and `appliedThemePresetId` (or equivalent) for per-section reset.

## Acceptance criteria

- [ ] User can apply layout A + theme B on the same workspace
- [ ] Control center tab shows preset thumbnails/names for quick layout and/or theme apply (exact UX per grill)
- [ ] Settings retains full theme editor for power users
- [ ] Editorial layout is a layout preset, not coupled to editorial colours
- [ ] Snapshot + library reset include new fields
- [ ] CONTEXT.md glossary distinguishes **layout preset** vs **theme preset**

## Blocked by

Glossary + model sign-off from grill session

## Comments

**Product feedback (2026-06-10):** Presets should be more visible (top notch tab); layout and theme should be independently composable. Current `ThemePreset` bundles both in `theme-presets.ts`.

**Grill locked (2026-06-10):** Fully independent catalogs — any layout × any theme. v1 layouts: `default`, `editorial`. v1 themes: six colour presets (Work, Personal, Editorial, Forest, Sunset, Ocean). Control center new tab with two sections: **Layout** (2 thumbnails) and **Theme** (6 swatches). No bundled combo shortcuts. Track `appliedLayoutPresetId` + `appliedThemePresetId` for per-section reset.
