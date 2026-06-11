import { afterEach, describe, expect, it, vi } from "vitest";
import { stringify } from "yaml";
import { initialKey } from "@/fractional-order/fractional-order";
import { loadOrSeedLibrary } from "@/library/library";
import { createInMemoryLibraryStore } from "@/library/store";
import {
  deserializeSnapshot,
  importSnapshotFromUrl,
  libraryToSnapshot,
  serializeSnapshot,
} from "./snapshot";
import { resolveTheme } from "@/theme/theme-defaults";

describe("serializeSnapshot", () => {
  it("round-trips the starter library without losing data", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());

    const yaml = serializeSnapshot(library);
    const restored = deserializeSnapshot(yaml);

    expect(restored).toEqual(library);
  });

  it("round-trips extended internal tools fields on a workspace", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const workspace = library.workspaces[0]!;

    library.workspaces[0] = {
      ...workspace,
      internalTools: {
        pomodoro: {
          ...workspace.internalTools.pomodoro,
          splitId: "custom",
          phase: "shortBreak",
          running: false,
          endsAt: null,
          chimeEnabled: true,
          activeTaskId: "task-1",
          completedWorkSessions: 2,
        },
        customFocusSplit: {
          id: "custom",
          label: "My split",
          workMinutes: 40,
          shortBreakMinutes: 8,
          longBreakMinutes: 16,
        },
        tasks: [
          {
            id: "task-1",
            title: "Ship snapshot",
            estimateMinutes: 45,
            today: true,
            completed: false,
            orderKey: initialKey(),
          },
        ],
      },
    };

    const restored = deserializeSnapshot(serializeSnapshot(library));

    expect(restored.workspaces[0]?.internalTools).toEqual(library.workspaces[0]!.internalTools);
  });

  it("round-trips focus countdown fields on the pomodoro record", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const workspace = library.workspaces[0]!;

    library.workspaces[0] = {
      ...workspace,
      internalTools: {
        ...workspace.internalTools,
        pomodoro: {
          ...workspace.internalTools.pomodoro,
          mode: "countdown",
          countdownMinutes: 30,
          running: true,
          endsAt: "2026-06-09T12:30:00.000Z",
          activeTaskId: "task-1",
        },
      },
    };

    const restored = deserializeSnapshot(serializeSnapshot(library));

    expect(restored.workspaces[0]?.internalTools.pomodoro).toMatchObject({
      mode: "countdown",
      countdownMinutes: 30,
      running: true,
      endsAt: "2026-06-09T12:30:00.000Z",
      activeTaskId: "task-1",
    });
  });

  it("backfills missing internal tools fields when importing older snapshots", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const snapshot = libraryToSnapshot(library);

    snapshot.workspaces[0]!.internalTools = {
      pomodoro: {
        splitId: "classic",
        phase: "work",
        running: false,
        endsAt: null,
        chimeEnabled: false,
        activeTaskId: null,
      },
      tasks: [],
    };

    const restored = deserializeSnapshot(stringify(snapshot));

    expect(restored.workspaces[0]?.internalTools).toMatchObject({
      customFocusSplit: null,
      pomodoro: {
        completedWorkSessions: 0,
      },
    });
  });

  it("round-trips appliedPresetId with shell border and widget styling", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const workspaceId = library.activeWorkspaceId;
    const baseTheme = resolveTheme(
      library.workspaces.find((workspace) => workspace.id === workspaceId)!.theme,
    );
    const withTheme = {
      ...library,
      workspaces: library.workspaces.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              theme: {
                ...baseTheme,
                appliedPresetId: "editorial",
                shellBorderColor: "#000000",
                widgets: {
                  ...baseTheme.widgets,
                  clock: {
                    ...baseTheme.widgets.clock,
                    zone: "lower-left",
                    text: "#000000",
                  },
                },
              },
            }
          : workspace,
      ),
    };

    const restored = deserializeSnapshot(serializeSnapshot(withTheme));
    const workspace = restored.workspaces.find((entry) => entry.id === workspaceId);

    expect(workspace?.theme.appliedPresetId).toBe("editorial");
    expect(workspace?.theme.shellBorderColor).toBe("#000000");
    expect(workspace?.theme.widgets.clock?.text).toBe("#000000");
    expect(workspace?.theme.widgets.clock?.zone).toBe("lower-left");
    expect(restored.schemaVersion).toBe(2);
  });

  it("round-trips shell border and canvas widget styling on workspace themes", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const workspaceId = library.activeWorkspaceId;
    const baseTheme = resolveTheme(
      library.workspaces.find((workspace) => workspace.id === workspaceId)!.theme,
    );
    const withTheme = {
      ...library,
      workspaces: library.workspaces.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              theme: {
                ...baseTheme,
                shellBorderColor: "#445566",
                widgets: {
                  ...baseTheme.widgets,
                  clock: {
                    ...baseTheme.widgets.clock,
                    text: "#ffffff",
                  },
                },
              },
            }
          : workspace,
      ),
    };

    const restored = deserializeSnapshot(serializeSnapshot(withTheme));
    const workspace = restored.workspaces.find((entry) => entry.id === workspaceId);

    expect(workspace?.theme.shellBorderColor).toBe("#445566");
    expect(workspace?.theme.widgets.clock?.text).toBe("#ffffff");
  });

  it("keeps theme background images as URL references in the snapshot", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const snapshot = libraryToSnapshot(library);

    for (const workspace of snapshot.workspaces) {
      if (workspace.theme.backgroundUrl) {
        const url = workspace.theme.backgroundUrl;
        expect(url.startsWith("http") || url.startsWith("/")).toBe(true);
        expect(url.startsWith("data:")).toBe(false);
      }
    }
  });
});

describe("deserializeSnapshot", () => {
  it("rejects invalid YAML", () => {
    expect(() => deserializeSnapshot("{\n  not: [yaml")).toThrow(/not valid yaml/i);
  });

  it("rejects pre-bump snapshot versions", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const yaml = serializeSnapshot(library).replace("version: 2", "version: 1");

    expect(() => deserializeSnapshot(yaml)).toThrow(/unsupported snapshot version/i);
  });

  it("rejects unsupported snapshot versions", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const yaml = serializeSnapshot(library).replace("version: 2", "version: 99");

    expect(() => deserializeSnapshot(yaml)).toThrow(/unsupported snapshot version/i);
  });

  it("drops legacy pin placements when importing a snapshot", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const snapshot = libraryToSnapshot(library);
    snapshot.workspaces[0]!.placements.pins = [
      { linkId: "github", position: "strip", order: "a0" },
    ];

    const restored = deserializeSnapshot(stringify(snapshot));

    expect(restored.workspaces[0]?.placements).toEqual({
      edges: restored.workspaces[0]!.placements.edges,
    });
    expect("pins" in restored.workspaces[0]!.placements).toBe(false);
  });

  it("does not write pin placements to exported snapshots", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());

    const snapshot = libraryToSnapshot(library);

    for (const workspace of snapshot.workspaces) {
      expect(workspace.placements).not.toHaveProperty("pins");
    }
  });
});

describe("importSnapshotFromUrl", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches YAML from a URL and deserializes the library", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const yaml = serializeSnapshot(library);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => yaml,
      }),
    );

    const imported = await importSnapshotFromUrl("https://example.com/yeti.yaml");

    expect(imported).toEqual(library);
  });

  it("surfaces fetch failures without changing the library", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    );

    await expect(importSnapshotFromUrl("https://example.com/missing.yaml")).rejects.toThrow(
      /failed to fetch snapshot/i,
    );
  });
});
