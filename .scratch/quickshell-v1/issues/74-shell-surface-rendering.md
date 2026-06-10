Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD-preset-themes.md`

## What to build

Render the three **shell surface** modes on the live **shell** rim and **notch**: `solid` (opaque fill, no blur), `glass` (frosted `backdrop-filter` with palette-tinted surface), `transparent` (lighter frosted fill via lower effective opacity). `glassOpacity` fine-tunes fill strength within `glass` and `transparent`.

Wire `themeToShellColors` (or equivalent) to respect `shellSurface`. Align with issue 66 frosted-glass direction where practical — `glass` and `transparent` should blur the canvas/background behind the rim, not only tint with alpha.

## Acceptance criteria

- [ ] `solid` shell renders opaque surface colour without backdrop blur
- [ ] `glass` shell blurs the background behind the rim with palette-tinted frosted fill
- [ ] `transparent` shell is visibly lighter than `glass` at the same `glassOpacity` (or uses a lower default opacity band documented in preset data)
- [ ] `glassOpacity` slider in settings affects shell fill strength for `glass` and `transparent`
- [ ] Graceful fallback when `backdrop-filter` is unsupported (opaque surface acceptable)
- [ ] Tests cover shell colour derivation per `shellSurface` mode

## Blocked by

- `.scratch/quickshell-v1/issues/72-preset-theme-model.md`

## Comments

Relates to `.scratch/quickshell-v1/issues/66-shell-backdrop-filter-frosted-glass.md` — implement frosted glass as part of `shellSurface` rather than a separate tint-only path.

Tracer bullet 3 of preset-themes rework.
