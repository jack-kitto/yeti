import { createStarterLibrary } from "./starter-template";
import type { Library, LibraryPatch, LibraryStore } from "./types";

export async function getLibrary(store: LibraryStore): Promise<Library | null> {
  return store.read();
}

export async function saveLibrary(
  store: LibraryStore,
  library: Library,
): Promise<Library> {
  await store.write(library);
  return library;
}

export async function loadOrSeedLibrary(store: LibraryStore): Promise<Library> {
  const existing = await store.read();
  if (existing) {
    return existing;
  }

  const starter = createStarterLibrary();
  await store.write(starter);
  return starter;
}

export async function applyPatch(
  store: LibraryStore,
  patch: LibraryPatch,
): Promise<Library> {
  const library = await store.read();
  if (!library) {
    throw new Error("Library not initialized");
  }

  const next: Library = {
    ...library,
    ...patch,
  };

  await store.write(next);
  return next;
}
