import type { Library } from "@/library/types";
import type { FocusRadioPlayback, FocusRadioStation } from "./types";
import { listFocusRadioStations } from "./stations";

export type FocusRadioNowPlaying = {
  id: string;
  label: string;
  kind: FocusRadioStation["kind"];
  url: string;
  imageUrl?: string;
};

export function resolveFocusRadioOutputVolume(
  playback: Pick<FocusRadioPlayback, "volume" | "muted">,
): number {
  if (playback.muted) {
    return 0;
  }

  return Math.min(1, Math.max(0, playback.volume));
}

export function resolveFocusRadioNowPlaying(library: Library): FocusRadioNowPlaying | null {
  const stationId = library.focusRadio.playback.stationId;
  if (!stationId) {
    return null;
  }

  const station = listFocusRadioStations(library).find((entry) => entry.id === stationId);
  if (!station) {
    return null;
  }

  return {
    id: station.id,
    label: station.label,
    kind: station.kind,
    url: station.url,
    imageUrl: station.imageUrl,
  };
}

export function shouldPlayFocusRadioStream(library: Library): boolean {
  const nowPlaying = resolveFocusRadioNowPlaying(library);
  return library.focusRadio.playback.playing && nowPlaying !== null && nowPlaying.kind === "stream";
}

export function shouldPlayFocusRadioYoutube(library: Library): boolean {
  const nowPlaying = resolveFocusRadioNowPlaying(library);
  return (
    library.focusRadio.playback.playing && nowPlaying !== null && nowPlaying.kind === "youtube"
  );
}
