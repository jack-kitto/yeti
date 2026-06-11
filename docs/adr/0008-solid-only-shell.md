# Solid-only shell fill

Status: Accepted

The **shell** rim and **notch** always use an opaque fill from `palette.surface`. An optional `shellBorderColor` draws a border when set; when absent, no border is drawn. There are no `glass`, `transparent`, or `glassOpacity` modes and no frosted `backdrop-filter` on the shell.

We rejected frosted-glass shell surfaces (issues 66, 74) because they added visual complexity without improving readability, produced renderer edge cases (issue 81), and fought the rice aesthetic goal of a crisp rim frame. Solid fill plus optional border is easier to theme, test, and explain.

**Considered:** Keep glass as a theme toggle (rejected — maintenance cost and inconsistent look across presets). Sample colours from wallpaper into shell (rejected — ADR 0007 already moved theming to explicit presets).
