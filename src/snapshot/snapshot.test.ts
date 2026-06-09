import { afterEach, describe, expect, it, vi } from "vitest";
import { loadOrSeedLibrary } from "@/library/library";
import { createInMemoryLibraryStore } from "@/library/store";
import { addPinToStrip } from "@/placement/placement-mutations";
import {
  deserializeSnapshot,
  importSnapshotFromUrl,
  libraryToSnapshot,
  serializeSnapshot,
} from "./snapshot";

describe("serializeSnapshot", () => {
  it("round-trips the starter library without losing data", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());

    const yaml = serializeSnapshot(library);
    const restored = deserializeSnapshot(yaml);

    expect(restored).toEqual(library);
  });

  it("keeps theme background images as URL references in the snapshot", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const snapshot = libraryToSnapshot(library);

    for (const workspace of snapshot.workspaces) {
      if (workspace.theme.backgroundUrl) {
        expect(workspace.theme.backgroundUrl.startsWith("http")).toBe(true);
        expect(workspace.theme.backgroundUrl.startsWith("data:")).toBe(false);
      }
    }
  });
});

describe("deserializeSnapshot", () => {
  it("rejects invalid YAML", () => {
    expect(() => deserializeSnapshot("{\n  not: [yaml")).toThrow(/not valid yaml/i);
  });

  it("rejects unsupported snapshot versions", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const yaml = serializeSnapshot(library).replace("version: 1", "version: 99");

    expect(() => deserializeSnapshot(yaml)).toThrow(/unsupported snapshot version/i);
  });

  it("round-trips strip and freeform pin placements", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const workspaceId = library.activeWorkspaceId;
    const stripLink = library.catalog.find((link) => link.id === "mdn")!;
    const freeformLink = library.catalog.find((link) => link.id === "docker")!;
    const withStrip = addPinToStrip(library, workspaceId, stripLink.id);
    const withFreeform = {
      ...withStrip,
      workspaces: withStrip.workspaces.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              placements: {
                ...workspace.placements,
                pins: [
                  ...workspace.placements.pins,
                  {
                    linkId: freeformLink.id,
                    position: { kind: "freeform" as const, x: 0.42, y: 0.18 },
                  },
                ],
              },
            }
          : workspace,
      ),
    };

    const restored = deserializeSnapshot(serializeSnapshot(withFreeform));

    expect(restored).toEqual(withFreeform);
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
