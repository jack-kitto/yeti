Status: done

Category: enhancement

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

Remove **shell surface** modes `glass` and `transparent`. The **shell** rim and **notch** are always an opaque solid fill from `palette.surface`, with an optional theme-controlled border (`shellBorderColor`, border width). No `backdrop-filter`, no frosted fill, no gloss/shadow glass stack in the canvas renderer.

Drop `glassOpacity` from the theme model (or ignore/remove in reset path). Update presets, settings UI, `themeToShellColors`, `ShellRimBackdrop`, and tests. Simplify `drawShell` to a single solid path.

## Acceptance criteria

- [x] Shell renders opaque surface colour on rim and notch at all times
- [x] Optional border colour respected (editorial-style black border ships as preset default where authored)
- [x] `glass`, `transparent`, and `glassOpacity` removed from theme type, presets, settings, and snapshot shape
- [x] `ShellRimBackdrop` and glass-specific CSS removed or inert
- [x] CONTEXT.md **shell border** glossary updated; ADR 0008 documents reversal of issue 66/74 direction
- [x] Tests updated; library reset seeds solid-only themes

## Blocked by

None — can start after glossary sign-off (issue 80 grill)

## Comments

**Product feedback (2026-06-10):** User wants to "nuke" glass/texture — shell should always be a solid colour with optional/theme-based border. Supersedes frosted-glass direction in issues 66 and 74.

**Grill locked (2026-06-10):** Delete `glass`, `transparent`, and `glassOpacity`. Shell fill is always opaque `palette.surface`. Border is optional — drawn only when `shellBorderColor` is set; otherwise no border. CONTEXT.md **shell border** term replaces **shell surface**.

**Shipped 2026-06-11.** Documented in ADR 0008.
