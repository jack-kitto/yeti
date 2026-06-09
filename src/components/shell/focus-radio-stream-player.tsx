"use client";

import { useEffect, useRef } from "react";
import {
  resolveFocusRadioNowPlaying,
  resolveFocusRadioOutputVolume,
  shouldPlayFocusRadioStream,
} from "@/focus-radio/playback";
import type { Library } from "@/library/types";

type FocusRadioStreamPlayerProps = {
  library: Library;
};

export function FocusRadioStreamPlayer({ library }: FocusRadioStreamPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadedUrlRef = useRef<string | null>(null);
  const playback = library.focusRadio.playback;
  const nowPlaying = resolveFocusRadioNowPlaying(library);
  const shouldPlay = shouldPlayFocusRadioStream(library);
  const streamUrl = nowPlaying?.kind === "stream" ? nowPlaying.url : null;

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
      void audio.play().catch(() => {
        // Browser autoplay policies or stream errors are handled in later slices.
      });
      return;
    }

    audio.pause();
  }, [playback.muted, playback.volume, shouldPlay, streamUrl]);

  return <audio ref={audioRef} className="shell-focus-radio-audio" aria-hidden />;
}
