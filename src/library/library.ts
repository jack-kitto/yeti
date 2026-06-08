import { createStarterLibrary } from "./starter-template";
import {
  addCatalogLink as addCatalogLinkToLibrary,
  deleteCatalogLink as deleteCatalogLinkFromLibrary,
  updateCatalogLink as updateCatalogLinkInLibrary,
} from "./catalog";
import { deserializeSnapshot, importSnapshotFromUrl } from "@/snapshot/snapshot";
import { updateWorkspaceTheme } from "@/theme/workspace-theme";
import {
  createWorkspace as createWorkspaceInLibrary,
  deleteWorkspace as deleteWorkspaceFromLibrary,
  renameWorkspace as renameWorkspaceInLibrary,
} from "@/workspace/workspaces";
import type {
  CatalogLinkInput,
  CatalogLinkPatch,
  Library,
  LibraryPatch,
  LibraryStore,
  ThemePatch,
} from "./types";

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

export async function addCatalogLink(
  store: LibraryStore,
  input: CatalogLinkInput,
): Promise<Library> {
  const library = await store.read();
  if (!library) {
    throw new Error("Library not initialized");
  }

  const next = addCatalogLinkToLibrary(library, input);
  return saveLibrary(store, next);
}

export async function updateCatalogLink(
  store: LibraryStore,
  linkId: string,
  patch: CatalogLinkPatch,
): Promise<Library> {
  const library = await store.read();
  if (!library) {
    throw new Error("Library not initialized");
  }

  const next = updateCatalogLinkInLibrary(library, linkId, patch);
  return saveLibrary(store, next);
}

export async function deleteCatalogLink(
  store: LibraryStore,
  linkId: string,
): Promise<Library> {
  const library = await store.read();
  if (!library) {
    throw new Error("Library not initialized");
  }

  const next = deleteCatalogLinkFromLibrary(library, linkId);
  return saveLibrary(store, next);
}

export async function mutateLibrary(
  store: LibraryStore,
  mutate: (library: Library) => Library,
): Promise<Library> {
  const library = await store.read();
  if (!library) {
    throw new Error("Library not initialized");
  }

  return saveLibrary(store, mutate(library));
}

export async function createWorkspace(
  store: LibraryStore,
  name: string,
): Promise<Library> {
  const library = await store.read();
  if (!library) {
    throw new Error("Library not initialized");
  }

  return saveLibrary(store, createWorkspaceInLibrary(library, name));
}

export async function renameWorkspace(
  store: LibraryStore,
  workspaceId: string,
  name: string,
): Promise<Library> {
  const library = await store.read();
  if (!library) {
    throw new Error("Library not initialized");
  }

  return saveLibrary(store, renameWorkspaceInLibrary(library, workspaceId, name));
}

export async function deleteWorkspace(
  store: LibraryStore,
  workspaceId: string,
): Promise<Library> {
  const library = await store.read();
  if (!library) {
    throw new Error("Library not initialized");
  }

  return saveLibrary(store, deleteWorkspaceFromLibrary(library, workspaceId));
}

export async function updateWorkspaceThemeInLibrary(
  store: LibraryStore,
  workspaceId: string,
  patch: ThemePatch,
): Promise<Library> {
  const library = await store.read();
  if (!library) {
    throw new Error("Library not initialized");
  }

  return saveLibrary(store, updateWorkspaceTheme(library, workspaceId, patch));
}

export async function importLibrarySnapshot(
  store: LibraryStore,
  yaml: string,
): Promise<Library> {
  const library = deserializeSnapshot(yaml);
  return saveLibrary(store, library);
}

export async function importLibrarySnapshotFromUrl(
  store: LibraryStore,
  url: string,
): Promise<Library> {
  const library = await importSnapshotFromUrl(url);
  return saveLibrary(store, library);
}
