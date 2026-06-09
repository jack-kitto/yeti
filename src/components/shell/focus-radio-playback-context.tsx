"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  resolveFocusRadioNowPlaying,
  resolveFocusRadioOutputVolume,
  shouldPlayFocusRadioStream,
  shouldPlayFocusRadioYoutube,
} from "@/focus-radio/playback";
import type { ExternalMediaGlance } from "@/focus-radio/media-session";
import {
  dispatchExternalMediaKey,
  resolveExternalMediaGlance,
  shouldAutoPauseFocusRadioForExternalGlance,
  shouldResumeFocusRadioAfterExternalGlance,
  syncFocusRadioMediaSession,
} from "@/focus-radio/media-session";
import { parseYoutubeVideoId } from "@/focus-radio/youtube";
import {
  FOCUS_RADIO_STREAM_RETRY_MS,
  resolveFocusRadioStreamFailureAction,
} from "@/focus-radio/stream-fallback";
import { updateFocusRadioPlayback } from "@/focus-radio/stations";
import { useMutateLibrary } from "@/hooks/use-library";
import type { Library } from "@/library/types";
import { FocusRadioYoutubePlayer } from "./focus-radio-youtube-player";

type FocusRadioPlaybackContextValue = {
  playbackError: string | null;
  retryPlayback: () => void;
  externalGlance: ExternalMediaGlance | null;
  dispatchExternalMediaKey: typeof dispatchExternalMediaKey;
};

const FocusRadioPlaybackContext = createContext<FocusRadioPlaybackContextValue | null>(null);

export function useFocusRadioPlayback() {
  const context = useContext(FocusRadioPlaybackContext);
  if (!context) {
    throw new Error("useFocusRadioPlayback must be used within FocusRadioPlaybackProvider");
  }

  return context;
}

type FocusRadioPlaybackProviderProps = {
  library: Library;
  children: ReactNode;
};

export function FocusRadioPlaybackProvider({ library, children }: FocusRadioPlaybackProviderProps) {
  const mutateLibrary = useMutateLibrary();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadedUrlRef = useRef<string | null>(null);
  const retriedCurrentRef = useRef(false);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const libraryRef = useRef(library);
  const wasPlayingBeforeExternalRef = useRef(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [externalGlance, setExternalGlance] = useState<ExternalMediaGlance | null>(null);

  libraryRef.current = library;

  const playback = library.focusRadio.playback;
  const nowPlaying = resolveFocusRadioNowPlaying(library);
  const shouldPlayStream = shouldPlayFocusRadioStream(library);
  const shouldPlayYoutube = shouldPlayFocusRadioYoutube(library);
  const streamUrl = nowPlaying?.kind === "stream" ? nowPlaying.url : null;
  const youtubeVideoId =
    nowPlaying?.kind === "youtube" ? parseYoutubeVideoId(nowPlaying.url) : null;
  const activeStationId = playback.stationId;

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const attemptPlayRef = useRef<() => void>(() => {});
  const handleStreamFailureRef = useRef<() => void>(() => {});

  attemptPlayRef.current = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    void audio.play().catch(() => {
      handleStreamFailureRef.current();
    });
  };

  const handleStreamFailure = useCallback(() => {
    const currentLibrary = libraryRef.current;
    const stationId = currentLibrary.focusRadio.playback.stationId;
    if (!stationId) {
      return;
    }

    const action = resolveFocusRadioStreamFailureAction(
      currentLibrary,
      stationId,
      retriedCurrentRef.current,
    );

    if (action.type === "retry") {
      retriedCurrentRef.current = true;
      setPlaybackError(null);
      clearRetryTimer();
      retryTimerRef.current = setTimeout(() => {
        const audio = audioRef.current;
        if (!audio) {
          return;
        }
        audio.load();
        attemptPlayRef.current();
      }, FOCUS_RADIO_STREAM_RETRY_MS);
      return;
    }

    if (action.type === "fallback") {
      retriedCurrentRef.current = false;
      setPlaybackError(null);
      mutateLibrary.mutate((current) =>
        updateFocusRadioPlayback(current, {
          stationId: action.stationId,
          playing: true,
        }),
      );
      return;
    }

    setPlaybackError("All stations failed to play. Try again.");
    mutateLibrary.mutate((current) => updateFocusRadioPlayback(current, { playing: false }));
  }, [clearRetryTimer, mutateLibrary]);

  handleStreamFailureRef.current = handleStreamFailure;

  const retryPlayback = useCallback(() => {
    retriedCurrentRef.current = false;
    setPlaybackError(null);
    mutateLibrary.mutate((current) => updateFocusRadioPlayback(current, { playing: true }));
  }, [mutateLibrary]);

  useEffect(() => {
    retriedCurrentRef.current = false;
    setPlaybackError(null);
    clearRetryTimer();
  }, [activeStationId, clearRetryTimer]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const onError = () => {
      handleStreamFailure();
    };

    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("error", onError);
      clearRetryTimer();
    };
  }, [clearRetryTimer, handleStreamFailure]);

  useEffect(() => {
    syncFocusRadioMediaSession(nowPlaying, playback.playing);

    if (!("mediaSession" in navigator)) {
      return;
    }

    function handlePlay() {
      mutateLibrary.mutate((current) => updateFocusRadioPlayback(current, { playing: true }));
    }

    function handlePause() {
      mutateLibrary.mutate((current) => updateFocusRadioPlayback(current, { playing: false }));
    }

    navigator.mediaSession.setActionHandler("play", handlePlay);
    navigator.mediaSession.setActionHandler("pause", handlePause);

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
    };
  }, [mutateLibrary, nowPlaying, playback.playing]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) {
      return;
    }

    function refreshExternalGlance() {
      const glance = resolveExternalMediaGlance(navigator.mediaSession.metadata, nowPlaying);
      setExternalGlance(glance);

      const currentLibrary = libraryRef.current;
      const focusRadioPlaying = currentLibrary.focusRadio.playback.playing;

      if (shouldAutoPauseFocusRadioForExternalGlance(focusRadioPlaying, glance)) {
        wasPlayingBeforeExternalRef.current = true;
        mutateLibrary.mutate((current) => updateFocusRadioPlayback(current, { playing: false }));
        return;
      }

      if (
        shouldResumeFocusRadioAfterExternalGlance(wasPlayingBeforeExternalRef.current, glance)
      ) {
        wasPlayingBeforeExternalRef.current = false;
        mutateLibrary.mutate((current) => updateFocusRadioPlayback(current, { playing: true }));
      }
    }

    refreshExternalGlance();
    const timer = window.setInterval(refreshExternalGlance, 1500);
    return () => window.clearInterval(timer);
  }, [mutateLibrary, nowPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = resolveFocusRadioOutputVolume(playback);

    if (!streamUrl) {
      loadedUrlRef.current = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      return;
    }

    if (loadedUrlRef.current !== streamUrl) {
      loadedUrlRef.current = streamUrl;
      audio.src = streamUrl;
      audio.load();
    }

    if (shouldPlayStream) {
      attemptPlayRef.current();
      return;
    }

    audio.pause();
  }, [playback.muted, playback.volume, shouldPlayStream, streamUrl]);

  return (
    <FocusRadioPlaybackContext
      value={{ playbackError, retryPlayback, externalGlance, dispatchExternalMediaKey }}
    >
      <audio ref={audioRef} className="shell-focus-radio-audio" aria-hidden />
      <FocusRadioYoutubePlayer
        videoId={youtubeVideoId}
        shouldPlay={shouldPlayYoutube}
        playback={playback}
        onError={handleStreamFailure}
      />
      {children}
    </FocusRadioPlaybackContext>
  );
}
