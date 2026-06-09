import { describe, expect, it } from "vitest";
import { createStarterLibrary } from "@/library/starter-template";
import { deserializeSnapshot, serializeSnapshot } from "@/snapshot/snapshot";
import { createDefaultFocusRadio } from "./config";
import { buildFocusRadioStationPickerRows } from "./station-picker";
import {
  addFocusRadioStation,
  listFocusRadioStations,
  moveFocusRadioStation,
  removeFocusRadioStation,
  updateFocusRadioPlayback,
  updateFocusRadioStation,
} from "./stations";

describe("createDefaultFocusRadio", () => {
  it("starts with no stations and paused playback preferences", () => {
    expect(createDefaultFocusRadio()).toEqual({
      stations: [],
      playback: {
        stationId: null,
        volume: 1,
        muted: false,
        playing: false,
      },
    });
  });
});

describe("starter library focus radio", () => {
  it("ships with an empty station list", () => {
    expect(createStarterLibrary().focusRadio.stations).toEqual([]);
  });
});

describe("addFocusRadioStation", () => {
  it("adds a trimmed station to the global library list", async () => {
    let library = createStarterLibrary();

    library = addFocusRadioStation(library, {
      label: "  Lofi  ",
      url: "  https://stream.example.com/lofi.mp3  ",
      kind: "stream",
      description: " Focus beats ",
      favorite: true,
    });

    expect(listFocusRadioStations(library)).toMatchObject([
      {
        label: "Lofi",
        url: "https://stream.example.com/lofi.mp3",
        kind: "stream",
        description: "Focus beats",
        favorite: true,
      },
    ]);
  });
});

describe("updateFocusRadioStation", () => {
  it("updates station fields without changing order", async () => {
    let library = addFocusRadioStation(createStarterLibrary(), {
      label: "Lofi",
      url: "https://stream.example.com/lofi.mp3",
      kind: "stream",
    }, "station-1");

    library = updateFocusRadioStation(library, "station-1", {
      label: "Night Lofi",
      kind: "youtube",
      url: "https://youtube.com/live/example",
      imageUrl: "https://img.example.com/logo.png",
    });

    expect(listFocusRadioStations(library)).toMatchObject([
      {
        id: "station-1",
        label: "Night Lofi",
        kind: "youtube",
        url: "https://youtube.com/live/example",
        imageUrl: "https://img.example.com/logo.png",
      },
    ]);
  });
});

describe("removeFocusRadioStation", () => {
  it("drops the station and clears playback when it was active", async () => {
    let library = addFocusRadioStation(createStarterLibrary(), {
      label: "Lofi",
      url: "https://stream.example.com/lofi.mp3",
      kind: "stream",
    }, "station-1");
    library = updateFocusRadioPlayback(library, {
      stationId: "station-1",
      playing: true,
    });

    library = removeFocusRadioStation(library, "station-1");

    expect(library.focusRadio.stations).toEqual([]);
    expect(library.focusRadio.playback).toMatchObject({
      stationId: null,
      playing: false,
    });
  });
});

describe("moveFocusRadioStation", () => {
  it("reorders stations by slot index", async () => {
    let library = createStarterLibrary();
    library = addFocusRadioStation(library, {
      label: "First",
      url: "https://stream.example.com/1.mp3",
      kind: "stream",
    }, "first");
    library = addFocusRadioStation(library, {
      label: "Second",
      url: "https://stream.example.com/2.mp3",
      kind: "stream",
    }, "second");

    library = moveFocusRadioStation(library, "second", 0);

    expect(listFocusRadioStations(library).map((station) => station.id)).toEqual([
      "second",
      "first",
    ]);
  });
});

describe("updateFocusRadioPlayback", () => {
  it("persists global volume, mute, and playing state", async () => {
    let library = addFocusRadioStation(createStarterLibrary(), {
      label: "Lofi",
      url: "https://stream.example.com/lofi.mp3",
      kind: "stream",
    }, "station-1");

    library = updateFocusRadioPlayback(library, {
      stationId: "station-1",
      volume: 1.5,
      muted: true,
      playing: true,
    });

    expect(library.focusRadio.playback).toEqual({
      stationId: "station-1",
      volume: 1,
      muted: true,
      playing: true,
    });
  });
});

describe("buildFocusRadioStationPickerRows", () => {
  it("lists stations with the active one marked and favorites pinned first", async () => {
    let library = createStarterLibrary();
    library = addFocusRadioStation(
      library,
      { label: "Techno", url: "https://stream.example.com/techno.mp3", kind: "stream" },
      "techno",
    );
    library = addFocusRadioStation(
      library,
      { label: "Lofi Girl", url: "https://stream.example.com/lofi.mp3", kind: "stream", favorite: true },
      "lofi",
    );
    library = addFocusRadioStation(
      library,
      { label: "Night Drive", url: "https://stream.example.com/night.mp3", kind: "stream" },
      "night",
    );
    library = updateFocusRadioPlayback(library, { stationId: "night" });

    expect(buildFocusRadioStationPickerRows(library)).toEqual([
      {
        id: "lofi",
        label: "Lofi Girl",
        kind: "stream",
        active: false,
        favorite: true,
      },
      {
        id: "techno",
        label: "Techno",
        kind: "stream",
        active: false,
        favorite: false,
      },
      {
        id: "night",
        label: "Night Drive",
        kind: "stream",
        active: true,
        favorite: false,
      },
    ]);
  });

  it("filters stations by label", async () => {
    let library = createStarterLibrary();
    library = addFocusRadioStation(
      library,
      { label: "Lofi Girl", url: "https://stream.example.com/lofi.mp3", kind: "stream" },
      "lofi",
    );
    library = addFocusRadioStation(
      library,
      { label: "Techno FM", url: "https://stream.example.com/techno.mp3", kind: "stream" },
      "techno",
    );

    expect(buildFocusRadioStationPickerRows(library, "lofi").map((row) => row.id)).toEqual(["lofi"]);
  });
});

describe("focus radio snapshot", () => {
  it("round-trips stations and playback preferences", async () => {
    let library = addFocusRadioStation(createStarterLibrary(), {
      label: "Lofi",
      url: "https://stream.example.com/lofi.mp3",
      kind: "stream",
    }, "station-1");
    library = updateFocusRadioPlayback(library, {
      stationId: "station-1",
      volume: 0.6,
      muted: false,
      playing: true,
    });

    const restored = deserializeSnapshot(serializeSnapshot(library));

    expect(restored.focusRadio).toEqual(library.focusRadio);
  });
});
