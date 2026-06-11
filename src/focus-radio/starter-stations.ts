import { initialKey, insertBetween } from "@/fractional-order/fractional-order";
import type { FocusRadio, FocusRadioStation } from "./types";

const firstKey = initialKey();
const secondKey = insertBetween(firstKey, null);
const thirdKey = insertBetween(secondKey, null);

/** Illustrative BYO stations for first-run demos and recordings. */
const STARTER_FOCUS_RADIO_STATIONS: FocusRadioStation[] = [
  {
    id: "station-fluid",
    label: "Fluid",
    url: "https://ice5.somafm.com/fluid-128-mp3",
    kind: "stream",
    description: "Instrumental hiphop, future soul and liquid trap.",
    imageUrl: "https://somafm.com/logos/256/fluid256.jpg",
    favorite: true,
    orderKey: firstKey,
  },
  {
    id: "station-groove-salad",
    label: "Groove Salad",
    url: "https://ice5.somafm.com/groovesalad-128-mp3",
    kind: "stream",
    description: "A lightly chilled plate of ambient beats.",
    imageUrl: "https://somafm.com/logos/256/groovesalad256.jpg",
    orderKey: secondKey,
  },
  {
    id: "station-def-con",
    label: "DEF CON",
    url: "https://ice5.somafm.com/defcon-128-mp3",
    kind: "stream",
    description: "Music for hacking.",
    imageUrl: "https://somafm.com/logos/256/defcon256.jpg",
    orderKey: thirdKey,
  },
];

export function createStarterFocusRadio(): FocusRadio {
  return {
    stations: STARTER_FOCUS_RADIO_STATIONS,
    playback: {
      stationId: null,
      volume: 0.85,
      muted: false,
      playing: false,
    },
  };
}
