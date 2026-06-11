import type { FocusRadio } from "./types";

export function createStarterFocusRadio(): FocusRadio {
  return {
    stations: [],
    playback: {
      stationId: null,
      volume: 0.85,
      muted: false,
      playing: false,
    },
  };
}
