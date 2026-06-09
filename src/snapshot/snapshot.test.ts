import { afterEach, describe, expect, it, vi } from "vitest";
import { stringify } from "yaml";
import { loadOrSeedLibrary } from "@/library/library";
import { createInMemoryLibraryStore } from "@/library/store";
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
