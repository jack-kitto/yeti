"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  applyPatch,
  loadOrSeedLibrary,
  resetLibrary,
  saveLibrary,
} from "@/library/library";
import { createIndexedDbLibraryStore } from "@/library/indexed-db-store";
import type { Library, LibraryPatch } from "@/library/types";

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
