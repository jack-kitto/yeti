import type { Library } from "@/library/types";
import type { FocusRadioStationKind } from "./types";
import { listFocusRadioStations } from "./stations";

export type FocusRadioStationPickerRow = {
  id: string;
  label: string;
  kind: FocusRadioStationKind;
  imageUrl?: string;
  active: boolean;
  favorite: boolean;
};

export function buildFocusRadioStationPickerRows(
  library: Library,
  query = "",
): FocusRadioStationPickerRow[] {
  const normalizedQuery = query.trim().toLowerCase();
  const stations = listFocusRadioStations(library).filter((station) =>
    normalizedQuery ? station.label.toLowerCase().includes(normalizedQuery) : true,
  );

  const favorites = stations.filter((station) => station.favorite);
  const rest = stations.filter((station) => !station.favorite);
  const activeStationId = library.focusRadio.playback.stationId;

  return [...favorites, ...rest].map((station) => ({
    id: station.id,
    label: station.label,
    kind: station.kind,
    imageUrl: station.imageUrl,
    active: station.id === activeStationId,
    favorite: station.favorite ?? false,
  }));
}
