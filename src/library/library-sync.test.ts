import { describe, expect, it, afterEach } from "vitest";
import { loadOrSeedLibrary, saveLibrary } from "./library";
import {
  createMemoryLibrarySync,
  resetLibrarySyncForTests,
  setLibrarySyncForTests,
} from "./library-sync";
import { createInMemoryLibraryStore } from "./store";
import { resolveStartPageLibrary } from "@/start/resolve-start-page-library";

describe("library sync", () => {
  afterEach(() => {
    resetLibrarySyncForTests();
  });

  it("notifies subscribers when the library is persisted", async () => {
    const sync = createMemoryLibrarySync();
    setLibrarySyncForTests(sync);
    let notifications = 0;
    sync.subscribe(() => {
      notifications += 1;
    });

    const store = createInMemoryLibraryStore();
    const library = await loadOrSeedLibrary(store);
    notifications = 0;

    await saveLibrary(store, library);

    expect(notifications).toBe(1);
  });

  it("lets the start page observe a library written elsewhere", async () => {
    const sync = createMemoryLibrarySync();
    setLibrarySyncForTests(sync);
    const store = createInMemoryLibraryStore();

    const initial = await resolveStartPageLibrary(store);
    expect(initial.source).toBe("starter");

    const refreshed = new Promise<Awaited<ReturnType<typeof resolveStartPageLibrary>>>(
      (resolve) => {
        sync.subscribe(() => {
          void resolveStartPageLibrary(store).then(resolve);
        });
      },
    );

    await loadOrSeedLibrary(store);
    const next = await refreshed;

    expect(next.source).toBe("library");
  });
});
