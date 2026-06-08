import { createStarterLibrary } from "./starter-template";
import type { Library, LibraryPatch, LibraryStore } from "./types";

export function validateLibrary(library: Library): void {
  for (const workspace of library.workspaces) {
    const seen = new Set<string>();

    for (const pin of workspace.placements.pins) {
      if (seen.has(pin.linkId)) {
        throw new Error(
          `Duplicate pin for link "${pin.linkId}" in workspace "${workspace.id}"`,
        );
      }

      seen.add(pin.linkId);
    }
  }
}

export async function getLibrary(store: LibraryStore): Promise<Library | null> {
  return store.read();
}

export async function saveLibrary(
  store: LibraryStore,
  library: Library,
): Promise<Library> {
  validateLibrary(library);
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

export async function resetLibrary(store: LibraryStore): Promise<Library> {
  const starter = createStarterLibrary();
  validateLibrary(starter);
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

  validateLibrary(next);
  await store.write(next);
  return next;
}
