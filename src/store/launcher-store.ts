import { create } from "zustand";
import type { EdgePosition } from "@/library/types";

type LauncherState = {
  open: boolean;
  edge: EdgePosition | null;
  showFullCatalog: boolean;
  openFromEdge: (edge: EdgePosition) => void;
  close: () => void;
  toggleCatalog: () => void;
};

export const useLauncherStore = create<LauncherState>((set) => ({
  open: false,
  edge: null,
  showFullCatalog: false,
  openFromEdge: (edge) =>
    set({ open: true, edge, showFullCatalog: false }),
  close: () => set({ open: false, edge: null, showFullCatalog: false }),
  toggleCatalog: () =>
    set((state) => ({ showFullCatalog: !state.showFullCatalog })),
}));
