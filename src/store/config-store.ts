import { create } from "zustand";

export type ConfigSection = "links" | "edges" | "pins" | "library";

type ConfigState = {
  open: boolean;
  section: ConfigSection;
  openSection: (section: ConfigSection) => void;
  close: () => void;
};

export const useConfigStore = create<ConfigState>((set) => ({
  open: false,
  section: "links",
  openSection: (section) => set({ open: true, section }),
  close: () => set({ open: false }),
}));
