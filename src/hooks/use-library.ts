"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCatalogLink,
  applyPatch,
  deleteCatalogLink,
  loadOrSeedLibrary,
  resetLibrary,
  saveLibrary,
  updateCatalogLink,
} from "@/library/library";
import { createIndexedDbLibraryStore } from "@/library/indexed-db-store";
import type { CatalogLinkInput, CatalogLinkPatch, Library, LibraryPatch } from "@/library/types";

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
    mutationFn: ({
      linkId,
      patch,
    }: {
      linkId: string;
      patch: CatalogLinkPatch;
    }) => updateCatalogLink(store, linkId, patch),
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
