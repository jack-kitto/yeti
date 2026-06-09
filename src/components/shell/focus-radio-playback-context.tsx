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
} from "@/focus-radio/playback";
import {
  FOCUS_RADIO_STREAM_RETRY_MS,
  resolveFocusRadioStreamFailureAction,
} from "@/focus-radio/stream-fallback";
import { updateFocusRadioPlayback } from "@/focus-radio/stations";
import { useMutateLibrary } from "@/hooks/use-library";
import type { Library } from "@/library/types";

type FocusRadioPlaybackContextValue = {
  playbackError: string | null;
  retryPlayback: () => void;
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
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  libraryRef.current = library;

  const playback = library.focusRadio.playback;
  const nowPlaying = resolveFocusRadioNowPlaying(library);
  const shouldPlay = shouldPlayFocusRadioStream(library);
  const streamUrl = nowPlaying?.kind === "stream" ? nowPlaying.url : null;
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

    if (shouldPlay) {
      attemptPlayRef.current();
      return;
    }

    audio.pause();
  }, [playback.muted, playback.volume, shouldPlay, streamUrl]);

  return (
    <FocusRadioPlaybackContext value={{ playbackError, retryPlayback }}>
      <audio ref={audioRef} className="shell-focus-radio-audio" aria-hidden />
      {children}
    </FocusRadioPlaybackContext>
  );
}
