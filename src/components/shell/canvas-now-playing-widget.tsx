"use client";

import { resolveFocusRadioNowPlaying } from "@/focus-radio/playback";
import { useLibrary } from "@/hooks/use-library";
import { CanvasNowPlayingVisualizer } from "./canvas-now-playing-visualizer";
import { useFocusRadioPlayback } from "./focus-radio-playback-context";

export function CanvasNowPlayingWidget() {
  const { data: library } = useLibrary();
  const { getStreamAnalyser } = useFocusRadioPlayback();

  if (!library) {
    return null;
  }

  const nowPlaying = resolveFocusRadioNowPlaying(library);
  const playing = library.focusRadio.playback.playing;

  if (!nowPlaying || !playing) {
    return null;
  }

  return (
    <div className="canvas-now-playing">
      <div className="canvas-now-playing-meta">
        {nowPlaying.imageUrl ? (
          <img
            src={nowPlaying.imageUrl}
            alt=""
            className="canvas-now-playing-artwork"
          />
        ) : (
          <span className="canvas-now-playing-artwork canvas-now-playing-artwork-fallback" aria-hidden>
            {nowPlaying.label.slice(0, 1)}
          </span>
        )}
        <div className="canvas-now-playing-copy">
          <p className="canvas-now-playing-label">{nowPlaying.label}</p>
          <p className="canvas-now-playing-kind">{nowPlaying.kind}</p>
        </div>
      </div>
      <CanvasNowPlayingVisualizer
        active={playing}
        getAnalyser={nowPlaying.kind === "stream" ? getStreamAnalyser : undefined}
      />
    </div>
  );
}
