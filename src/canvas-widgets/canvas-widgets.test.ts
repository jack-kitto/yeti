import { describe, expect, it } from "vitest";
import { formatClockDisplay } from "./clock";
import {
  CANVAS_WIDGET_IDS,
  createDefaultCanvasWidgets,
  listEnabledCanvasWidgets,
  setCanvasWidgetEnabled,
} from "./config";
import { pickQuote } from "./quote";
import { formatWelcomeMessage } from "./welcome";
import { loadOrSeedLibrary } from "@/library/library";
import { createInMemoryLibraryStore } from "@/library/store";
import { ensureWorkspaceCanvasWidgets } from "./defaults";

describe("formatClockDisplay", () => {
  it("formats the current time and weekday date for the canvas clock widget", () => {
    const now = new Date("2026-06-09T14:30:00.000Z");

    expect(formatClockDisplay(now, "en-US", "UTC")).toEqual({
      time: "2:30 PM",
      date: "Tuesday, June 9",
    });
  });

  it("uses the runtime local timezone when none is provided", () => {
    const now = new Date("2026-06-09T14:30:00.000Z");

    expect(formatClockDisplay(now)).toEqual({
      time: new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(now),
      date: new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(now),
    });
  });
});

describe("formatWelcomeMessage", () => {
  it("greets with the workspace name using time of day", () => {
    expect(formatWelcomeMessage("Work", new Date("2026-06-09T09:00:00.000Z"), "UTC")).toBe(
      "Good morning, Work",
    );
    expect(formatWelcomeMessage("Work", new Date("2026-06-09T15:00:00.000Z"), "UTC")).toBe(
      "Good afternoon, Work",
    );
  });
});

describe("pickQuote", () => {
  it("returns a bundled quote deterministically from a seed", () => {
    const first = pickQuote(0);
    const again = pickQuote(0);
    const next = pickQuote(1);

    expect(first.text).toBeTruthy();
    expect(again).toEqual(first);
    expect(next.text).not.toBe(first.text);
  });
});

describe("createDefaultCanvasWidgets", () => {
  it("enables all v1 canvas widgets for a new workspace", () => {
    expect(createDefaultCanvasWidgets()).toEqual({
      clock: true,
      welcome: true,
      quote: true,
    });
  });
});

describe("listEnabledCanvasWidgets", () => {
  it("returns only enabled widgets in canonical order", () => {
    const workspace = ensureWorkspaceCanvasWidgets({
      id: "ws-1",
      name: "Work",
      theme: {
        palette: { background: "#000", surface: "#111", text: "#fff", accent: "#f00" },
        glassOpacity: 0.5,
        borderRadius: 12,
      },
      placements: { edges: { left: [], top: [], bottom: [] }, pins: [] },
      internalTools: {
        pomodoro: {
          splitId: "classic",
          phase: "work",
          running: false,
          endsAt: null,
          chimeEnabled: false,
          activeTaskId: null,
        },
        tasks: [],
      },
      canvasWidgets: { clock: true, welcome: false, quote: true },
    });

    expect(listEnabledCanvasWidgets(workspace)).toEqual(["clock", "quote"]);
    expect(CANVAS_WIDGET_IDS).toEqual(["clock", "welcome", "quote"]);
  });
});

describe("setCanvasWidgetEnabled", () => {
  it("toggles a widget for one workspace without affecting others", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const workspaceId = library.activeWorkspaceId;
    const otherId = library.workspaces.find((workspace) => workspace.id !== workspaceId)!.id;

    const updated = setCanvasWidgetEnabled(library, workspaceId, "clock", false);

    const active = updated.workspaces.find((workspace) => workspace.id === workspaceId)!;
    const other = updated.workspaces.find((workspace) => workspace.id === otherId)!;

    expect(active.canvasWidgets.clock).toBe(false);
    expect(other.canvasWidgets.clock).toBe(true);
  });
});

describe("ensureWorkspaceCanvasWidgets", () => {
  it("backfills canvas widget toggles for libraries saved before issue 32", async () => {
    const store = createInMemoryLibraryStore();
    const seeded = await loadOrSeedLibrary(store);
    const legacy = {
      ...seeded,
      workspaces: seeded.workspaces.map(({ canvasWidgets: _canvasWidgets, ...workspace }) => workspace),
    };
    await store.write(legacy as typeof seeded);

    const loaded = await loadOrSeedLibrary(store);
    const workspace = loaded.workspaces.find((entry) => entry.id === loaded.activeWorkspaceId)!;

    expect(workspace.canvasWidgets).toEqual(createDefaultCanvasWidgets());
  });
});
