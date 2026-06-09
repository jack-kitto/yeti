Status: ready-for-agent

## Parent

`.scratch/quickshell-v1/issues/27-top-rim-control-center.md`

## What to build

**Media** tab in the control center: searchable station picker, `stream` and `youtube` playback, play/pause/volume/mute, stream retry/fallback, background playback when the pocket closes, and **media session** glance strip when another tab is playing (external transport auto-pauses focus radio).

## Acceptance criteria

- [ ] Media tab plays user-configured stations with v1 controls
- [ ] Station picker search/filter; active station highlighted; empty state links to settings
- [ ] Global playback state persists across reload
- [ ] Stream failure retries once then falls back to next station
- [ ] Media session strip overlays when external tab is playing; radio resumes rules per issue 27

## Blocked by

- `.scratch/quickshell-v1/issues/42-focus-radio-library-settings.md`

## Comments

Tracer bullet 4 of 4 for issue 27.
