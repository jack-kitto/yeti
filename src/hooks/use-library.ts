"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCatalogLink,
  applyPatch,
  createWorkspace,
  deleteCatalogLink,
  deleteWorkspace,
  importLibrarySnapshotFromUrl,
  loadOrSeedLibrary,
  mutateLibrary,
  renameWorkspace,
  resetLibrary,
  saveLibrary,
  updateCatalogLink,
  updateWorkspaceThemeInLibrary,
} from "@/library/library";
import { createIndexedDbLibraryStore } from "@/library/indexed-db-store";
import type {
  CatalogLinkInput,
  CatalogLinkPatch,
  Library,
  LibraryPatch,
  ThemePatch,
} from "@/library/types";

const store = createIndexedDbLibraryStore();

export function useLibrary() {
  return useQuery({
    queryKey: ["library"],
    queryFn: () => loadOrSeedLibrary(store),
  });
}

export function useApplyLibraryPatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: LibraryPatch) => applyPatch(store, patch),
    onSuccess: (library) => {
      queryClient.setQueryData(["library"], library);
    },
  });
}

export function useSaveLibrary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (library: Library) => saveLibrary(store, library),
    onSuccess: (library) => {
      queryClient.setQueryData(["library"], library);
    },
  });
}

export function useResetLibrary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => resetLibrary(store),
    onSuccess: (library) => {
      queryClient.setQueryData(["library"], library);
    },
  });
}

export function useAddCatalogLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CatalogLinkInput) => addCatalogLink(store, input),
    onSuccess: (library) => {
      queryClient.setQueryData(["library"], library);
    },
  });
}

export function useUpdateCatalogLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ linkId, patch }: { linkId: string; patch: CatalogLinkPatch }) =>
      updateCatalogLink(store, linkId, patch),
    onSuccess: (library) => {
      queryClient.setQueryData(["library"], library);
    },
  });
}

export function useDeleteCatalogLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (linkId: string) => deleteCatalogLink(store, linkId),
    onSuccess: (library) => {
      queryClient.setQueryData(["library"], library);
    },
  });
}

export function useMutateLibrary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mutate: (library: Library) => Library) => mutateLibrary(store, mutate),
    onSuccess: (library) => {
      queryClient.setQueryData(["library"], library);
    },
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createWorkspace(store, name),
    onSuccess: (library) => {
      queryClient.setQueryData(["library"], library);
    },
  });
}

export function useRenameWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, name }: { workspaceId: string; name: string }) =>
      renameWorkspace(store, workspaceId, name),
    onSuccess: (library) => {
      queryClient.setQueryData(["library"], library);
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId: string) => deleteWorkspace(store, workspaceId),
    onSuccess: (library) => {
      queryClient.setQueryData(["library"], library);
    },
  });
}

export function useUpdateWorkspaceTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, patch }: { workspaceId: string; patch: ThemePatch }) =>
      updateWorkspaceThemeInLibrary(store, workspaceId, patch),
    onSuccess: (library) => {
      queryClient.setQueryData(["library"], library);
    },
  });
}

export function useImportLibrarySnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (url: string) => importLibrarySnapshotFromUrl(store, url),
    onSuccess: (library) => {
      queryClient.setQueryData(["library"], library);
    },
  });
}
