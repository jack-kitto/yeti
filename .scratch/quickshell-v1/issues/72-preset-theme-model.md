Status: done

## Parent

`.scratch/quickshell-v1/PRD-preset-themes.md`

## What to build

Replace the extraction-based **theme** model with the explicit shape from ADR 0007 and wire it end-to-end through CSS application — the foundation slice everything else builds on.

Extend each workspace **theme** with `shellSurface` (`solid` | `glass` | `transparent`), per-**canvas widget** styling (`zone`, `order`, `text`, `textMuted`, `textShadow`), and `appliedPresetId` for later reset support. Remove `paletteOverrides`, `paletteExtractedFromUrl`, palette extraction hooks, `extract-colors` dependency, and any canvas image-sampling contrast code (including uncommitted work).

`applyTheme` must emit CSS variables for shell tokens and per-widget canvas tokens. Provide sensible defaults when older-shaped theme data is absent (defensive only — migration is reset, not load-time upgrade).

## Acceptance criteria

- [x] `Theme` type matches PRD shape: `shellSurface`, `widgets` record, `appliedPresetId`; extraction fields removed
- [x] `extract-colors`, `palette-extraction`, and `usePaletteExtraction` removed; no runtime extraction on background URL change
- [x] `applyTheme` / `themeToCssVars` apply shell palette, `shellSurface`, `glassOpacity`, and per-widget colour variables
- [x] Canvas widgets use theme CSS variables (not image sampling or semi-transparent `color-mix` on primary copy)
- [x] Tests cover theme-to-CSS-var mapping and default widget style fallbacks

## Blocked by

None — can start immediately

## Comments

Tracer bullet 1 of preset-themes rework. See `docs/adr/0007-preset-themes-no-extraction.md`.
