import { describe, expect, it } from "vitest";
import {
  applyPatch,
  getLibrary,
  loadOrSeedLibrary,
  resetLibrary,
  saveLibrary,
} from "./library";
import { STARTER_CATALOG } from "./starter-template";
import { createInMemoryLibraryStore } from "./store";
import { EDGE_PREVIEW_LIMIT } from "@/placement/placement";

describe("loadOrSeedLibrary", () => {
  it("returns starter template with Work and Personal workspaces when store is empty", async () => {
    const store = createInMemoryLibraryStore();

    const library = await loadOrSeedLibrary(store);

    expect(library.workspaces.map((w) => w.name)).toEqual(["Work", "Personal"]);
    expect(library.activeWorkspaceId).toBe(library.workspaces[0].id);
  });

  it("seeds each workspace with a distinct theme", async () => {
    const store = createInMemoryLibraryStore();

    const library = await loadOrSeedLibrary(store);
    const [work, personal] = library.workspaces;

    expect(work.theme.backgroundUrl).not.toBe(personal.theme.backgroundUrl);
    expect(work.theme.palette.background).not.toBe(personal.theme.palette.background);
  });

  it("seeds a large catalog with enough left-edge links to open the launcher", async () => {
    const store = createInMemoryLibraryStore();

    const library = await loadOrSeedLibrary(store);
    const work = library.workspaces.find((workspace) => workspace.name === "Work")!;

    expect(library.catalog.length).toBe(STARTER_CATALOG.length);
    expect(library.catalog.length).toBeGreaterThanOrEqual(30);
    const devTools = work.placements.edges.left.find(
      (group) => group.name === "Dev tools",
    )!;
    expect(devTools.links.length).toBeGreaterThan(EDGE_PREVIEW_LIMIT);
    expect(work.placements.edges.left.length).toBeGreaterThan(1);
    expect(devTools.name).toBe("Dev tools");
    expect(devTools.handleIcon).toBe("🛠");
  });

  it("does not re-seed when the store already has a library", async () => {
    const store = createInMemoryLibraryStore();
    const seeded = await loadOrSeedLibrary(store);
    seeded.catalog = [];
    await saveLibrary(store, seeded);

    const loaded = await loadOrSeedLibrary(store);

    expect(loaded.catalog).toEqual([]);
    expect(loaded.workspaces.map((w) => w.name)).toEqual(["Work", "Personal"]);
  });
});

describe("saveLibrary and getLibrary", () => {
  it("rejects a library with duplicate pins for the same link in a workspace", async () => {
    const store = createInMemoryLibraryStore();
    const library = await loadOrSeedLibrary(store);
    const workspace = library.workspaces[0];
    workspace.placements.pins.push({
      linkId: workspace.placements.pins[0].linkId,
      position: { kind: "strip", orderKey: "z9" },
    });

    await expect(saveLibrary(store, library)).rejects.toThrow(/duplicate pin/i);
  });

  it("persists the library so a later read returns the same data", async () => {
    const store = createInMemoryLibraryStore();
    const library = await loadOrSeedLibrary(store);
    library.catalog[0].title = "GitHub — updated";

    await saveLibrary(store, library);
    const retrieved = await getLibrary(store);

    expect(retrieved?.catalog[0].title).toBe("GitHub — updated");
  });
});

describe("resetLibrary", () => {
  it("wipes custom data and re-seeds the starter template", async () => {
    const store = createInMemoryLibraryStore();
    const library = await loadOrSeedLibrary(store);
    library.catalog = [];
    library.workspaces[0].name = "Custom";
    await saveLibrary(store, library);

    const reset = await resetLibrary(store);

    expect(reset.catalog.length).toBe(STARTER_CATALOG.length);
    expect(reset.workspaces.map((workspace) => workspace.name)).toEqual([
      "Work",
      "Personal",
    ]);
    expect((await getLibrary(store))?.catalog.length).toBe(STARTER_CATALOG.length);
  });
});

describe("applyPatch", () => {
  it("switches the active workspace", async () => {
    const store = createInMemoryLibraryStore();
    const library = await loadOrSeedLibrary(store);
    const personalId = library.workspaces.find((w) => w.name === "Personal")!.id;

    const updated = await applyPatch(store, { activeWorkspaceId: personalId });

    expect(updated.activeWorkspaceId).toBe(personalId);
    expect((await getLibrary(store))?.activeWorkspaceId).toBe(personalId);
  });
});
