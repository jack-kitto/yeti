import type { WorkspaceInternalTools } from "@/internal-tools/types";
import type { FractionalOrderKey } from "@/fractional-order/fractional-order";
import type { CanvasWidgetConfig } from "@/canvas-widgets/types";

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

export type ThemePatch = {
  palette?: Partial<ThemePalette>;
  backgroundUrl?: string | null;
  glassOpacity?: number;
  borderRadius?: number;
};

export type EdgeGroupLinkPlacement = {
  linkId: string;
  orderKey: FractionalOrderKey;
};

export type EdgeGroup = {
  id: string;
  name: string;
  handleIcon?: string;
  orderKey: FractionalOrderKey;
  links: EdgeGroupLinkPlacement[];
};

export type EdgePlacements = {
  left: EdgeGroup[];
  top: EdgeGroup[];
  bottom: EdgeGroup[];
};

export type PinPosition =
  | { kind: "strip"; orderKey: FractionalOrderKey }
  | { kind: "freeform"; x: number; y: number };

export type WorkspacePlacements = {
  edges: EdgePlacements;
  pins: { linkId: string; position: PinPosition }[];
};

export type Workspace = {
  id: string;
  name: string;
  theme: Theme;
  placements: WorkspacePlacements;
  internalTools: WorkspaceInternalTools;
  canvasWidgets: CanvasWidgetConfig;
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

export type CatalogLinkInput = {
  url: string;
  title?: string;
  image?: string;
};

export type CatalogLinkPatch = {
  url?: string;
  title?: string;
  image?: string;
};

export type LibraryStore = {
  read(): Promise<Library | null>;
  write(library: Library): Promise<void>;
};

export type EdgePosition = "left" | "top" | "bottom";
