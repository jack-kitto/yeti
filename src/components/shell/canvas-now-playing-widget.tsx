"use client";

import {
  dismissCanvasNowPlaying,
  shouldShowCanvasNowPlayingWidget,
} from "@/canvas-widgets/now-playing";
import { resolveFocusRadioNowPlaying } from "@/focus-radio/playback";
import { updateFocusRadioPlayback } from "@/focus-radio/stations";
import { useLibrary, useMutateLibrary } from "@/hooks/use-library";
import type { Workspace } from "@/library/types";
import { CanvasNowPlayingVisualizer } from "./canvas-now-playing-visualizer";
import { useFocusRadioPlayback } from "./focus-radio-playback-context";

type CanvasNowPlayingWidgetProps = {
  workspace: Workspace;
};

export function CanvasNowPlayingWidget({ workspace }: CanvasNowPlayingWidgetProps) {
  const { data: library } = useLibrary();
  const mutateLibrary = useMutateLibrary();
  const { getStreamAnalyser } = useFocusRadioPlayback();

  if (!library || !shouldShowCanvasNowPlayingWidget(workspace, library)) {
    return null;
  }

  const nowPlaying = resolveFocusRadioNowPlaying(library);
  const playing = library.focusRadio.playback.playing;

  if (!nowPlaying) {
    return null;
  }

  function patchPlayback(patch: Parameters<typeof updateFocusRadioPlayback>[1]) {
    mutateLibrary.mutate((current) => updateFocusRadioPlayback(current, patch));
  }

  function handleTogglePlay() {
    patchPlayback({ playing: !playing });
  }

  function handleDismiss() {
    mutateLibrary.mutate((current) => dismissCanvasNowPlaying(current, workspace.id));
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
      <div className="canvas-now-playing-actions">
        <button
          type="button"
          className="canvas-now-playing-action"
          onClick={handleTogglePlay}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          className="canvas-now-playing-action canvas-now-playing-action-dismiss"
          onClick={handleDismiss}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
