# Yeti demo assets (WebReel)

Record polished MP4 clips and retina screenshots for X posts using [WebReel](https://github.com/vercel-labs/webreel). Unlike DOM-replay tools, WebReel captures real browser frames — canvas rim, theme backgrounds, and CSS all render correctly.

Requires a running dev server on **port 3000**. Chrome and ffmpeg are downloaded automatically to `~/.webreel` on first run.

## Quick run

```bash
# Terminal 1 — kill other Next processes so this binds to port 3000
npm run dev

# Terminal 2
npm run demo              # all videos + screenshots
npm run demo:preview      # dry-run in a visible browser (no recording)
```

Record individual clips:

```bash
npx webreel record hero edge-notches universal-input focus-radio
npx webreel record full-demo   # single combined X-post reel
```

## Output

| Asset | Path |
| ----- | ---- |
| Combined reel | `webreel-output/videos/yeti-x-demo.mp4` |
| Per-scenario clips | `webreel-output/videos/*.mp4` |
| Screenshots | `webreel-output/screenshots/*.png` |

## What it demos

1. **hero** — Work workspace at rest
2. **edge-notches** — left-rim hover flyouts (`Today`, `Yeti`, `Docs`)
3. **universal-input** — type-to-focus (`lin` → arrow down → open)
4. **focus-radio** — control center → Fluid stream → play → canvas now-playing visualizer
5. **full-demo** — all of the above in one clip

Steps live in [`webreel.config.json`](./webreel.config.json). Use `npm run demo:preview <name>` to tune timings before recording.

## Tips

- **Fresh library seed:** WebReel uses a clean browser profile; `/home` auto-seeds the starter template.
- **Production mode** is stabler for long sessions: `npm run build && npm run start`.
- Viewport uses the **macbook-pro** preset (~14″ laptop). Keystroke HUD is hidden so typing looks natural.
- Draft X copy: [`x-post.md`](./x-post.md).
