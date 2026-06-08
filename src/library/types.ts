export type Link = {
  id: string;
  url: string;
  title?: string;
  image?: string;
};

export type ThemePalette = {
  background: string;
  surface: string;
  text: string;
  accent: string;
};

export type Theme = {
  palette: ThemePalette;
  backgroundUrl?: string;
  glassOpacity: number;
  borderRadius: number;
};

export type PinPosition =
  | { kind: "strip"; order: number }
  | { kind: "freeform"; x: number; y: number };

export type WorkspacePlacements = {
  edges: { left: string[]; top: string[]; bottom: string[] };
  pins: { linkId: string; position: PinPosition }[];
};

export type Workspace = {
  id: string;
  name: string;
  theme: Theme;
  placements: WorkspacePlacements;
};

export type ShortcutBindings = {
  focusCommandBar: string;
  cycleWorkspace: string;
};

export type Library = {
  catalog: Link[];
  workspaces: Workspace[];
  shortcuts: ShortcutBindings;
  activeWorkspaceId: string;
};

export type LibraryPatch = {
  activeWorkspaceId?: string;
};

export type LibraryStore = {
  read(): Promise<Library | null>;
  write(library: Library): Promise<void>;
};
