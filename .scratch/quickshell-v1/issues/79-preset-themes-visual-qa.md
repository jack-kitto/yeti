Status: ready-for-human

Category: enhancement

## Parent

`.scratch/quickshell-v1/PRD-preset-themes.md`

## What to build

Human visual QA and sign-off on the six **theme presets** after issues 72–78 land. Verify readability, **shell surface** modes, **canvas zone** placement, and **workspace transition** morph on real hardware.

Checklist-driven — no code unless QA finds blocking defects (file follow-up issues for those).

## Acceptance criteria

- [ ] All six presets readable on canvas widgets at 1440×900 and 2560×1440
- [ ] `solid`, `glass`, and `transparent` **shell surface** modes look intentional on at least Work and Personal presets
- [ ] Custom background URL + manual widget colour tweak path verified (silent swap, user can recover via preset re-apply or reset)
- [ ] Work ↔ Personal **workspace transition** signed off (palette morph, background swap, no widget flash)
- [ ] **Start page** backdrop matches active workspace theme with new shape

## Blocked by

- `.scratch/quickshell-v1/issues/73-theme-preset-catalog.md`
- `.scratch/quickshell-v1/issues/74-shell-surface-rendering.md`
- `.scratch/quickshell-v1/issues/75-canvas-zone-layout.md`
- `.scratch/quickshell-v1/issues/76-settings-theme-editor.md`
- `.scratch/quickshell-v1/issues/77-library-reset-theme-schema.md`
- `.scratch/quickshell-v1/issues/78-workspace-transition-theme-morph.md`

## Comments

Tracer bullet 8 — HITL sign-off slice. Issue 12 motion/visual umbrella may close related items after this passes.

**QA findings (2026-06-10):** Sign-off blocked — file follow-ups:

- Issue 81 — left/right notch bottom-corner double border (editorial)
- Issue 82 — editorial preset pomodoro canvas gap when timer running
- Issue 80 — product wants solid-only shell (revisit glass QA criteria)
- Issue 83 — layout/theme preset split + control center surfacing
- Issue 84 — workspace transition motion revision
