"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FocusRadioPlayback } from "@/focus-radio/types";
import { syncFocusRadioYoutubePlayer } from "@/focus-radio/youtube-player-sync";

type YoutubePlayerInstance = {
  loadVideoById: (videoId: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  destroy: () => void;
};

type YoutubePlayerConstructor = new (
  elementId: string,
  options: {
    height: string;
    width: string;
    videoId?: string;
    playerVars?: { autoplay?: 0 | 1; controls?: 0 | 1 };
    events?: {
      onError?: () => void;
      onReady?: (event: { target: YoutubePlayerInstance }) => void;
    };
  },
) => YoutubePlayerInstance;

type YoutubeApi = {
  Player: YoutubePlayerConstructor;
};

declare global {
  interface Window {
    YT?: YoutubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<YoutubeApi> | null = null;

function loadYoutubeApi(): Promise<YoutubeApi> {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve) => {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        if (window.YT?.Player) {
          resolve(window.YT);
        }
      };

      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.append(script);
    });
  }

  return youtubeApiPromise;
}

type FocusRadioYoutubePlayerProps = {
  videoId: string | null;
  shouldPlay: boolean;
  playback: FocusRadioPlayback;
  onError: () => void;
  onPlayerReady?: (player: YoutubePlayerInstance) => void;
};

export function FocusRadioYoutubePlayer({
  videoId,
  shouldPlay,
  playback,
  onError,
  onPlayerReady,
}: FocusRadioYoutubePlayerProps) {
  const elementId = useId().replace(/:/g, "");
  const playerRef = useRef<YoutubePlayerInstance | null>(null);
  const loadedVideoIdRef = useRef<string | null>(null);
  const onErrorRef = useRef(onError);
  const onPlayerReadyRef = useRef(onPlayerReady);
  const playbackRef = useRef(playback);
  const shouldPlayRef = useRef(shouldPlay);
  const videoIdRef = useRef(videoId);
  const [playerReady, setPlayerReady] = useState(false);

  onErrorRef.current = onError;
  onPlayerReadyRef.current = onPlayerReady;
  playbackRef.current = playback;
  shouldPlayRef.current = shouldPlay;
  videoIdRef.current = videoId;

  useEffect(() => {
    let cancelled = false;

    void loadYoutubeApi().then((api) => {
      if (cancelled) {
        return;
      }

      playerRef.current = new api.Player(elementId, {
        height: "0",
        width: "0",
        playerVars: { autoplay: 0, controls: 0 },
        events: {
          onError: () => {
            onErrorRef.current();
          },
          onReady: (event) => {
            setPlayerReady(true);
            onPlayerReadyRef.current?.(event.target);
            syncFocusRadioYoutubePlayer(event.target, {
              videoId: videoIdRef.current,
              shouldPlay: shouldPlayRef.current,
              playback: playbackRef.current,
              loadedVideoIdRef,
            });
          },
        },
      });
    });

    return () => {
      cancelled = true;
      setPlayerReady(false);
      playerRef.current?.destroy();
      playerRef.current = null;
      loadedVideoIdRef.current = null;
    };
  }, [elementId]);

  useEffect(() => {
    if (!playerReady) {
      return;
    }

    const player = playerRef.current;
    if (!player) {
      return;
    }

    syncFocusRadioYoutubePlayer(player, {
      videoId,
      shouldPlay,
      playback,
      loadedVideoIdRef,
    });
  }, [playback, playerReady, shouldPlay, videoId]);

  return <div id={elementId} className="shell-focus-radio-youtube" aria-hidden />;
}
