Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

When a workspace **theme** background image URL is set or changed, derive the default **palette** tokens (`background`, `surface`, `text`, `accent`) client-side from that image using [extract-colors](https://www.npmjs.com/package/extract-colors) (or equivalent). This closes the follow-up from issue 08 and matches `CONTEXT.md`: extraction is the default; **settings** manual token edits remain supported.

Trigger extraction when the user updates the background image URL in workspace settings (and on initial seed for starter workspaces that ship with a background URL). Do not clobber tokens the user has manually edited after extraction — track overrides or only auto-fill empty/default palettes (pick one approach in implementation; test the chosen behavior).

Glass opacity, border radius, and other non-palette theme fields are unchanged by extraction.

## Acceptance criteria

- [ ] Changing a workspace background image URL updates palette tokens from the image (client-side, no server)
- [ ] Extracted palette maps to all four tokens and applies live on the active workspace shell
- [ ] User can still manually override any palette token in settings after extraction
- [ ] Manual overrides are not silently overwritten on reload (only re-extract when background URL changes, or explicit user action — document in issue comment when shipped)
- [ ] Extraction failure (bad URL, CORS, network) fails gracefully — keep previous palette, show non-blocking feedback in settings
- [ ] Behavior covered by tests through public theme/palette modules (mock image input or fixture)

## Blocked by

None — issue 08 (manual theme editing) is done

## Comments

Follow-up from `.scratch/quickshell-v1/issues/08-config-themes-workspaces.md` (grill 2025-06). Domain language: `CONTEXT.md` → **Theme**.

Suggested tracer bullets:
1. Pure function: image/colors → `ThemePalette` mapping + tests
2. Wire to settings background URL change + live apply
3. Override / re-extract semantics + starter template backfill if needed
