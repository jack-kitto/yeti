Status: done

## Parent

`.scratch/quickshell-v1/PRD-preset-themes.md`

## What to build

Ship the six bundled **theme presets** (Work, Personal, and four additional moods) as a code-defined catalog. Each preset is a complete **theme** blob: shell palette, **shell surface**, `glassOpacity`, background URL or solid colour, and per-**canvas widget** zone/order/colours/shadows.

Implement preset apply: selecting a preset copies theme fields onto the active workspace (not **canvas widget** on/off toggles) and sets `appliedPresetId`. Add a visual preset grid to **settings** workspace theme section — selecting a preset applies live on the active workspace.

Refresh the **starter template** Work and Personal workspaces to use fully-authored preset themes from the catalog.

## Acceptance criteria

- [x] Six **theme presets** exist with designer-intentional background + per-widget pairings
- [x] Applying a preset updates shell palette, **shell surface**, background, and per-widget styling on the workspace
- [x] **Canvas widget** on/off toggles are unchanged after preset apply
- [x] `appliedPresetId` is stored on the workspace theme for reset support
- [x] Settings shows a preset picker grid; active workspace updates live on selection
- [x] Starter template Work and Personal use two of the six presets
- [x] Tests cover preset apply semantics (copied fields, untouched toggles, `appliedPresetId`)

## Blocked by

- `.scratch/quickshell-v1/issues/72-preset-theme-model.md`

## Comments

Tracer bullet 2 of preset-themes rework.
