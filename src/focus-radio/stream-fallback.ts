import type { Library } from "@/library/types";
import { listFocusRadioStations } from "./stations";

export const FOCUS_RADIO_STREAM_RETRY_MS = 3000;

export type FocusRadioStreamFailureAction =
  | { type: "retry" }
  | { type: "fallback"; stationId: string }
  | { type: "exhausted" };

export function resolveFocusRadioStreamFailureAction(
  library: Library,
  stationId: string,
  retriedCurrent: boolean,
): FocusRadioStreamFailureAction {
  if (!retriedCurrent) {
    return { type: "retry" };
  }

  const stations = listFocusRadioStations(library);
  const currentIndex = stations.findIndex((station) => station.id === stationId);
  if (currentIndex === -1 || stations.length <= 1) {
    return { type: "exhausted" };
  }

  for (let offset = 1; offset < stations.length; offset++) {
    const nextStation = stations[(currentIndex + offset) % stations.length];
    if (nextStation.id !== stationId) {
      return { type: "fallback", stationId: nextStation.id };
    }
  }

  return { type: "exhausted" };
}
