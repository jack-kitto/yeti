# Preset themes — Product Requirements Document

Status: ready-for-agent

## Problem Statement

Workspace **themes** today rely on client-side palette extraction from background images, plus ad-hoc contrast fixes and a separate canvas text-sampling layer. The result does not work reliably: **canvas widget** copy is often hard to read on wallpaper backdrops, shell and canvas colours fight each other, and users cannot get a polished look without manual token surgery. There is no curated starting point beyond two hand-tuned starter workspaces.

Developers want a handful of designer-tested **theme presets** that work out of the box, the freedom to build their own look, and per-widget control over placement and colours so widgets stay readable on any background they choose.

## Solution

Replace extraction-driven theming with **preset-only** explicit styling:

- Six bundled **theme presets** (including refreshed Work and Personal) that copy onto a workspace's inline **theme** on selection
- **Shell surface** modes: `solid`, `glass`, `transparent`, fine-tuned with `glassOpacity`
- Per-**canvas widget** **canvas zone** placement (five zones), in-zone stack order, and colours (`text`, `textMuted`, `textShadow`)
- **Settings** preset grid, shell overrides, collapsible per-widget styling, and per-section reset to the last applied preset
- Custom background URLs remain supported; styling does not auto-change (user tunes manually or re-applies a preset)
- Theme model change requires **library reset** — no migration

## User Stories

### Presets

1. As a developer, I want six bundled **theme presets** to choose from, so that I can get a polished workspace look without tuning colours myself.
2. As a developer, I want to apply a **theme preset** from **settings**, so that shell palette, **shell surface**, background, and per-widget placement/colours update in one action.
3. As a developer, I want preset apply to leave my **canvas widget** on/off toggles unchanged, so that enabling/disabling widgets stays a separate preference.
4. As a developer, I want Work and Personal starter workspaces to ship with fully-authored preset-quality themes, so that first run looks intentional.

### Shell styling

5. As a developer, I want to choose a **shell surface** style (`solid`, `glass`, `transparent`), so that the rim and **notch** match the mood I want.
6. As a developer, I want a `glassOpacity` control within glass and transparent modes, so that I can fine-tune how much shell presence I see.
7. As a developer, I want shell palette tokens to drive rim chrome, flyouts, and **settings**, so that the frame feels cohesive.

### Canvas widgets

8. As a developer, I want each enabled **canvas widget** placed in a **canvas zone** (`center`, `upper-center`, `lower-left`, `lower-right`, `bottom-center`), so that widgets sit where they read best on the background.
9. As a developer, I want stack order within a zone, so that multiple widgets in the same zone arrange predictably.
10. As a developer, I want per-widget `text`, `textMuted`, and `textShadow` colours, so that clock, welcome, quote, now-playing, tasks, and pomodoro can each contrast their area of the wallpaper.
11. As a developer, I want widget styling to come from the **theme**, not runtime image sampling, so that colours are stable and predictable.

### Customization

12. As a developer, I want to override shell palette, **shell surface**, opacity, and background after applying a preset, so that I can personalize without starting from scratch.
13. As a developer, I want per-widget zone and colour controls in **settings**, so that I can fix readability on a custom wallpaper.
14. As a developer, I want to reset individual theme sections back to the last applied preset, so that I can recover from bad tweaks without a full **library reset**.
15. As a developer, I want theme changes on the active workspace to apply live on the **shell**, so that I see results immediately.

### Backgrounds

16. As a developer, I want to set a background image URL or solid colour, so that I can use my own wallpaper.
17. As a developer, I understand that changing the background does not auto-adjust widget colours, so that I know to re-apply a preset or tune widget styling manually.

### Workspace transitions

18. As a developer, I want **workspace transition** palette morph to cover the expanded theme tokens, so that switching Work ↔ Personal still feels smooth.

### Library & snapshots

19. As a developer, I want theme shape changes to require **library reset**, so that the upgrade path is explicit and simple pre-v1.
20. As a developer, I want exported **library snapshots** to include the new theme shape, so that dotfiles backups stay portable.

### Surfaces

21. As a developer, I want the **start page** to use the active workspace **theme** as backdrop, so that new-tab search matches my home station look.

## Implementation Decisions

- **ADR:** `docs/adr/0007-preset-themes-no-extraction.md` — presets-only; no `extract-colors`; no canvas image sampling.
- **Theme storage:** Inline on each **workspace** record (not a shared theme library). **Theme preset** selection copies values onto the workspace theme.
- **Theme shape** (conceptual):

```ts
type ShellSurface = "solid" | "glass" | "transparent";

type CanvasZone =
  | "center"
  | "upper-center"
  | "lower-left"
  | "lower-right"
  | "bottom-center";

type CanvasWidgetStyle = {
  zone: CanvasZone;
  order: number;
  text: string;
  textMuted: string;
  textShadow: string;
};

type Theme = {
  palette: ThemePalette; // background, surface, text, accent — shell chrome
  shellSurface: ShellSurface;
  glassOpacity: number;
  borderRadius: number;
  backgroundUrl?: string;
  widgets: Record<CanvasWidgetId, CanvasWidgetStyle>;
  appliedPresetId?: string; // tracks last preset for per-section reset
};
```

- **Remove:** `paletteOverrides`, `paletteExtractedFromUrl`, `usePaletteExtraction`, `palette-extraction` module, `extract-colors` dependency, uncommitted canvas image-sampling contrast code.
- **Preset catalog:** Six code-defined presets with designer-tested background + per-widget pairings.
- **Preset apply scope:** Shell palette, **shell surface**, background, per-widget zone/colours/shadows only — not **canvas widget** enables.
- **Custom background:** Silent swap; no nudge banner.
- **Migration:** **Library reset** required; bump snapshot schema version if the project versions snapshots.
- **Issue 66:** `shellSurface: glass | transparent` should use real `backdrop-filter` frosted glass where supported; align when implementing shell surface rendering.

## Testing Decisions

Test external behaviour through existing seams — prefer pure functions and CSS-var application over DOM snapshots.

| Seam | What to test |
|------|----------------|
| Theme → CSS vars | `applyTheme` / `themeToCssVars` emit shell and per-widget variables for each `shellSurface` and widget style |
| Preset apply | Applying a preset copies expected theme fields; widget toggles unchanged; `appliedPresetId` set |
| Preset reset | Resetting a section restores values from the tracked preset |
| Canvas zones | Enabled widgets render in configured zones with theme colours (module-level layout helper or component test with jsdom) |
| Shell surface | `themeToShellColors` (or successor) produces distinct output for solid vs glass vs transparent |
| Workspace transition | `lerpPalette` / transition snapshot includes new theme fields without discontinuity |
| Snapshot round-trip | Serialize/deserialize library with new theme shape |

Prior art: `src/theme/workspace-theme.test.ts`, `src/theme/theme.ts`, `src/shell-frame/workspace-transition.test.ts`, `src/library/library.test.ts`.

Do not test `extract-colors` mapping or image pixel sampling — those paths are removed.

## Out of Scope

- First-class theme records shared across workspaces (deferred)
- Auto palette extraction or canvas image sampling (rejected — ADR 0007)
- Free-form pixel positioning of **canvas widgets** (zones only in v1)
- Shell grain / canvas overlay texture tokens (deferred)
- Per-widget surface pills / card backgrounds (deferred)
- Nudge banner on custom background change (rejected)
- Library load-time theme migration (rejected — **library reset**)
- Additional presets beyond the initial six (future point releases)
- **Theme preset** apply changing **canvas widget** on/off toggles (rejected)

## Further Notes

- Supersedes the direction of issues 44 and 63 (palette extraction and extracted-palette canvas contrast). Do not extend extraction; remove it.
- Human visual QA on all six presets across common viewport sizes is a **ready-for-human** sign-off slice after implementation.
- Discard uncommitted `canvas-text-contrast` / `use-canvas-text-contrast` work — incompatible with ADR 0007.
