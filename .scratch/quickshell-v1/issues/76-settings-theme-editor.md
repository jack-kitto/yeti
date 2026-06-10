Status: done

## Parent

`.scratch/quickshell-v1/PRD-preset-themes.md`

## What to build

Complete the **settings** theme editor beyond the preset grid (issue 73): shell overrides (palette pickers, **shell surface** selector, `glassOpacity`, background URL/colour) and collapsible per-**canvas widget** sections (zone, in-zone order, `text`, `textMuted`, `textShadow`).

Add per-section **reset to preset**: shell block and each widget block can restore values from `appliedPresetId` without re-applying the whole preset. If no preset has been applied, reset controls are hidden or disabled.

## Acceptance criteria

- [x] User can edit shell palette, **shell surface**, `glassOpacity`, and background on the active workspace with live shell preview
- [x] User can edit per-widget zone, order, and colours for each widget type in collapsible sections
- [x] "Reset" on the shell section restores shell/background fields from the last applied **theme preset**
- [x] "Reset" on each widget section restores that widget's fields from the last applied preset
- [x] Reset is unavailable when `appliedPresetId` is unset
- [x] Tests cover reset-to-preset behaviour for shell and widget sections

## Blocked by

- `.scratch/quickshell-v1/issues/73-theme-preset-catalog.md`
- `.scratch/quickshell-v1/issues/75-canvas-zone-layout.md`

## Comments

Tracer bullet 5 of preset-themes rework.
