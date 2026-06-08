import { describe, expect, it } from "vitest";
import { applyPatch, getLibrary, loadOrSeedLibrary, saveLibrary } from "./library";
import { createInMemoryLibraryStore } from "./store";

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
  it("persists the library so a later read returns the same data", async () => {
    const store = createInMemoryLibraryStore();
    const library = await loadOrSeedLibrary(store);
    library.catalog[0].title = "GitHub — updated";

    await saveLibrary(store, library);
    const retrieved = await getLibrary(store);

    expect(retrieved?.catalog[0].title).toBe("GitHub — updated");
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
