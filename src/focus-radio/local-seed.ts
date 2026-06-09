import { parse } from "yaml";
import { initialKey, insertBetween } from "@/fractional-order/fractional-order";
import type { Library } from "@/library/types";
import type { FocusRadioStation, FocusRadioStationKind } from "./types";

type LocalSeedStation = {
  label: string;
  url: string;
  kind: FocusRadioStationKind;
  imageUrl?: string;
  description?: string;
  favorite?: boolean;
};

export function parseFocusRadioLocalSeed(yaml: string): LocalSeedStation[] {
  const document = parse(yaml);
  if (!document || typeof document !== "object" || Array.isArray(document)) {
    throw new Error("Focus radio seed must be a YAML mapping");
  }

  const stations = (document as { stations?: unknown }).stations;
  if (!Array.isArray(stations)) {
    throw new Error("Focus radio seed is missing stations");
  }

  return stations.map((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`Focus radio seed station ${index + 1} must be a mapping`);
    }

    const record = entry as Record<string, unknown>;
    const label = typeof record.label === "string" ? record.label.trim() : "";
    const url = typeof record.url === "string" ? record.url.trim() : "";
    const kind = record.kind;

    if (!label || !url) {
      throw new Error(`Focus radio seed station ${index + 1} needs label and url`);
    }

    if (kind !== "stream" && kind !== "youtube") {
      throw new Error(`Focus radio seed station ${index + 1} has invalid kind`);
    }

    return {
      label,
      url,
      kind,
      ...(typeof record.imageUrl === "string" && record.imageUrl.trim()
        ? { imageUrl: record.imageUrl.trim() }
        : {}),
      ...(typeof record.description === "string" && record.description.trim()
        ? { description: record.description.trim() }
        : {}),
      ...(record.favorite === true ? { favorite: true } : {}),
    };
  });
}

export function applyFocusRadioLocalSeed(library: Library, yaml: string): Library {
  if (library.focusRadio.stations.length > 0) {
    return library;
  }

  const seedStations = parseFocusRadioLocalSeed(yaml);
  if (seedStations.length === 0) {
    return library;
  }

  let previousKey: string | null = null;
  const stations: FocusRadioStation[] = seedStations.map((entry) => {
    const orderKey = previousKey ? insertBetween(previousKey, null) : initialKey();
    previousKey = orderKey;

    return {
      id: crypto.randomUUID(),
      label: entry.label,
      url: entry.url,
      kind: entry.kind,
      orderKey,
      ...(entry.imageUrl ? { imageUrl: entry.imageUrl } : {}),
      ...(entry.description ? { description: entry.description } : {}),
      ...(entry.favorite ? { favorite: true } : {}),
    };
  });

  return {
    ...library,
    focusRadio: {
      ...library.focusRadio,
      stations,
    },
  };
}
