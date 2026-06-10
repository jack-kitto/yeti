"use client";

import { useEffect, useId, useRef } from "react";
import { resolveFocusRadioOutputVolume } from "@/focus-radio/playback";
import type { FocusRadioPlayback } from "@/focus-radio/types";

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
          onError: onError,
          onReady: (event) => {
            onPlayerReady?.(event.target);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      loadedVideoIdRef.current = null;
    };
  }, [elementId, onError]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    const outputVolume = resolveFocusRadioOutputVolume(playback);
    player.setVolume(Math.round(outputVolume * 100));
    if (playback.muted || outputVolume === 0) {
      player.mute();
    } else {
      player.unMute();
    }

    if (!videoId) {
      loadedVideoIdRef.current = null;
      player.pauseVideo();
      return;
    }

    if (loadedVideoIdRef.current !== videoId) {
      loadedVideoIdRef.current = videoId;
      player.loadVideoById(videoId);
    }

    if (shouldPlay) {
      player.playVideo();
      return;
    }

    player.pauseVideo();
  }, [playback.muted, playback.volume, shouldPlay, videoId]);

  return <div id={elementId} className="shell-focus-radio-youtube" aria-hidden />;
}
