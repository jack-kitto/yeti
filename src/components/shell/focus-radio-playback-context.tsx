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
import { resolveFocusRadioStreamProxyUrl } from "@/focus-radio/stream-proxy";
import { useMutateLibrary } from "@/hooks/use-library";
import type { Library } from "@/library/types";
import { FocusRadioYoutubePlayer } from "./focus-radio-youtube-player";

type FocusRadioPlaybackContextValue = {
  playbackError: string | null;
  retryPlayback: () => void;
  externalGlance: ExternalMediaGlance | null;
  dispatchExternalMediaKey: typeof dispatchExternalMediaKey;
  getStreamAnalyser: () => AnalyserNode | null;
  streamVisualizerActive: boolean;
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
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const elementSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
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

  const teardownStreamAnalyser = useCallback(() => {
    elementSourceRef.current?.disconnect();
    elementSourceRef.current = null;
    analyserRef.current?.disconnect();
    analyserRef.current = null;

    const context = audioContextRef.current;
    audioContextRef.current = null;
    if (context && context.state !== "closed") {
      void context.close();
    }
  }, []);

  const ensureStreamAnalyser = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (analyserRef.current) {
      void audioContextRef.current?.resume();
      return;
    }

    try {
      const context = new AudioContext();
      audioContextRef.current = context;

      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.35;
      analyser.minDecibels = -85;
      analyser.maxDecibels = -10;

      const source = context.createMediaElementSource(audio);
      elementSourceRef.current = source;
      source.connect(analyser);
      analyser.connect(context.destination);
      analyserRef.current = analyser;
      void context.resume();
    } catch {
      teardownStreamAnalyser();
    }
  }, [teardownStreamAnalyser]);

  attemptPlayRef.current = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    void audio
      .play()
      .then(() => {
        ensureStreamAnalyser();
        void audioContextRef.current?.resume();
      })
      .catch(() => {
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
  }, [activeStationId, clearRetryTimer, streamUrl]);

  useEffect(() => {
    return () => {
      teardownStreamAnalyser();
    };
  }, [teardownStreamAnalyser]);

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

      if (shouldResumeFocusRadioAfterExternalGlance(wasPlayingBeforeExternalRef.current, glance)) {
        wasPlayingBeforeExternalRef.current = false;
        mutateLibrary.mutate((current) => updateFocusRadioPlayback(current, { playing: true }));
      }
    }

    refreshExternalGlance();
    const timer = window.setInterval(refreshExternalGlance, 1500);
    return () => window.clearInterval(timer);
  }, [mutateLibrary, nowPlaying]);

  const getStreamAnalyser = useCallback(() => analyserRef.current, []);

  const playbackStreamUrl = streamUrl ? resolveFocusRadioStreamProxyUrl(streamUrl) : null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = resolveFocusRadioOutputVolume(playback);

    if (!playbackStreamUrl) {
      loadedUrlRef.current = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      return;
    }

    if (loadedUrlRef.current !== playbackStreamUrl) {
      loadedUrlRef.current = playbackStreamUrl;
      audio.src = playbackStreamUrl;
      audio.load();
    }

    if (shouldPlayStream) {
      attemptPlayRef.current();
      return;
    }

    audio.pause();
  }, [playback.muted, playback.volume, playbackStreamUrl, shouldPlayStream]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !streamUrl) {
      return;
    }

    let retryTimer: ReturnType<typeof setInterval> | null = null;

    const handlePlaying = () => {
      ensureStreamAnalyser();
      if (analyserRef.current || retryTimer) {
        return;
      }

      let attempts = 0;
      retryTimer = setInterval(() => {
        attempts += 1;
        ensureStreamAnalyser();
        if ((analyserRef.current || attempts >= 12) && retryTimer) {
          clearInterval(retryTimer);
          retryTimer = null;
        }
      }, 250);
    };

    audio.addEventListener("playing", handlePlaying);
    return () => {
      audio.removeEventListener("playing", handlePlaying);
      if (retryTimer) {
        clearInterval(retryTimer);
      }
    };
  }, [ensureStreamAnalyser, streamUrl]);

  return (
    <FocusRadioPlaybackContext
      value={{
        playbackError,
        retryPlayback,
        externalGlance,
        dispatchExternalMediaKey,
        getStreamAnalyser,
        streamVisualizerActive: shouldPlayStream,
      }}
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
