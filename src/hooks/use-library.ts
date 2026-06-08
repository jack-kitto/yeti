"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applyPatch, loadOrSeedLibrary } from "@/library/library";
import { createIndexedDbLibraryStore } from "@/library/indexed-db-store";
import type { LibraryPatch } from "@/library/types";

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
