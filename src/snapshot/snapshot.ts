import { parse, stringify } from "yaml";
import { createDefaultCanvasWidgets } from "@/canvas-widgets/config";
import { createDefaultFocusRadio } from "@/focus-radio/config";
import { ensureWorkspaceInternalTools } from "@/internal-tools/defaults";
import { createDefaultWorkspaceInternalTools } from "@/internal-tools/pomodoro";
import type { FocusRadio } from "@/focus-radio/types";
import type { WorkspaceInternalTools } from "@/internal-tools/types";
import { validateLibrary } from "@/library/library";
import { normalizeWorkspacePlacements } from "@/library/migrate-placements";
import type {
  EdgeGroup,
  EdgeGroupLinkPlacement,
  Library,
  Link,
  ShortcutBindings,
  Theme,
  Workspace,
} from "@/library/types";
import type { CanvasWidgetConfig } from "@/canvas-widgets/types";

export const SNAPSHOT_VERSION = 1;

type SnapshotLinkPlacement = {
  id: string;
  order: string;
};

type SnapshotEdgeGroup = {
  id: string;
  name: string;
  icon?: string;
  order: string;
  linkIds: SnapshotLinkPlacement[];
};

type SnapshotPin =
  | {
      linkId: string;
      position: "strip";
      order: string;
    }
  | {
      linkId: string;
      position: { x: number; y: number };
    };

type SnapshotWorkspace = {
  id: string;
  name: string;
  theme: Theme;
  placements: {
    edgeGroups: {
      left: SnapshotEdgeGroup[];
      top: SnapshotEdgeGroup[];
      bottom: SnapshotEdgeGroup[];
    };
    pins?: SnapshotPin[];
  };
  internalTools?: WorkspaceInternalTools;
  canvasWidgets?: CanvasWidgetConfig;
  icsFeedUrl?: string;
};

export type LibrarySnapshot = {
  version: typeof SNAPSHOT_VERSION;
  catalog: Link[];
  workspaces: SnapshotWorkspace[];
  shortcuts: ShortcutBindings;
  focusRadio?: FocusRadio;
  activeWorkspaceId: string;
};

function edgeGroupToSnapshot(group: EdgeGroup): SnapshotEdgeGroup {
  return {
    id: group.id,
    name: group.name,
    ...(group.handleIcon ? { icon: group.handleIcon } : {}),
    order: group.orderKey,
    linkIds: group.links.map((placement) => ({
      id: placement.linkId,
      order: placement.orderKey,
    })),
  };
}

function snapshotEdgeGroupToLibrary(group: SnapshotEdgeGroup): EdgeGroup {
  return {
    id: group.id,
    name: group.name,
    ...(group.icon ? { handleIcon: group.icon } : {}),
    orderKey: group.order,
    links: group.linkIds.map(
      (placement): EdgeGroupLinkPlacement => ({
        linkId: placement.id,
        orderKey: placement.order,
      }),
    ),
  };
}

export function libraryToSnapshot(library: Library): LibrarySnapshot {
  return {
    version: SNAPSHOT_VERSION,
    catalog: library.catalog.map((link) => ({
      id: link.id,
      url: link.url,
      ...(link.title !== undefined ? { title: link.title } : {}),
      ...(link.image !== undefined ? { image: link.image } : {}),
    })),
    workspaces: library.workspaces.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      theme: {
        palette: { ...workspace.theme.palette },
        ...(workspace.theme.backgroundUrl
          ? { backgroundUrl: workspace.theme.backgroundUrl }
          : {}),
        glassOpacity: workspace.theme.glassOpacity,
        borderRadius: workspace.theme.borderRadius,
      },
      placements: {
        edgeGroups: {
          left: workspace.placements.edges.left.map(edgeGroupToSnapshot),
          top: workspace.placements.edges.top.map(edgeGroupToSnapshot),
          bottom: workspace.placements.edges.bottom.map(edgeGroupToSnapshot),
        },
      },
      internalTools: workspace.internalTools,
      canvasWidgets: workspace.canvasWidgets,
      ...(workspace.icsFeedUrl ? { icsFeedUrl: workspace.icsFeedUrl } : {}),
    })),
    shortcuts: { ...library.shortcuts },
    focusRadio: {
      stations: library.focusRadio.stations.map((station) => ({ ...station })),
      playback: { ...library.focusRadio.playback },
    },
    activeWorkspaceId: library.activeWorkspaceId,
  };
}

export function snapshotToLibrary(snapshot: LibrarySnapshot): Library {
  const library: Library = {
    catalog: snapshot.catalog.map((link) => ({
      id: link.id,
      url: link.url,
      ...(link.title !== undefined ? { title: link.title } : {}),
      ...(link.image !== undefined ? { image: link.image } : {}),
    })),
    workspaces: snapshot.workspaces.map((workspace): Workspace =>
      ensureWorkspaceInternalTools({
        id: workspace.id,
        name: workspace.name,
        theme: {
          palette: { ...workspace.theme.palette },
          ...(workspace.theme.backgroundUrl
            ? { backgroundUrl: workspace.theme.backgroundUrl }
            : {}),
          glassOpacity: workspace.theme.glassOpacity,
          borderRadius: workspace.theme.borderRadius,
        },
        placements: normalizeWorkspacePlacements({
          edges: {
            left: workspace.placements.edgeGroups.left.map(snapshotEdgeGroupToLibrary),
            top: workspace.placements.edgeGroups.top.map(snapshotEdgeGroupToLibrary),
            bottom: workspace.placements.edgeGroups.bottom.map(snapshotEdgeGroupToLibrary),
          },
          pins: workspace.placements.pins,
        }),
        internalTools:
          workspace.internalTools ?? createDefaultWorkspaceInternalTools(),
        canvasWidgets: workspace.canvasWidgets ?? createDefaultCanvasWidgets(),
        ...(workspace.icsFeedUrl ? { icsFeedUrl: workspace.icsFeedUrl } : {}),
      }),
    ),
    shortcuts: { ...snapshot.shortcuts },
    focusRadio: snapshot.focusRadio
      ? {
          stations: snapshot.focusRadio.stations.map((station) => ({ ...station })),
          playback: { ...snapshot.focusRadio.playback },
        }
      : createDefaultFocusRadio(),
    activeWorkspaceId: snapshot.activeWorkspaceId,
  };

  validateLibrary(library);
  return library;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseSnapshotDocument(document: unknown): LibrarySnapshot {
  if (!isRecord(document)) {
    throw new Error("Snapshot must be a YAML mapping");
  }

  if (document.version !== SNAPSHOT_VERSION) {
    throw new Error(`Unsupported snapshot version: ${String(document.version)}`);
  }

  if (!Array.isArray(document.catalog) || !Array.isArray(document.workspaces)) {
    throw new Error("Snapshot is missing catalog or workspaces");
  }

  if (!isRecord(document.shortcuts) || typeof document.activeWorkspaceId !== "string") {
    throw new Error("Snapshot is missing shortcuts or activeWorkspaceId");
  }

  return document as LibrarySnapshot;
}

export function serializeSnapshot(library: Library): string {
  return stringify(libraryToSnapshot(library), {
    lineWidth: 0,
  });
}

export function deserializeSnapshot(yaml: string): Library {
  let document: unknown;

  try {
    document = parse(yaml);
  } catch {
    throw new Error("Snapshot is not valid YAML");
  }

  return snapshotToLibrary(parseSnapshotDocument(document));
}

export async function fetchSnapshotYaml(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch snapshot (${response.status})`);
  }

  return response.text();
}

export async function importSnapshotFromUrl(url: string): Promise<Library> {
  const yaml = await fetchSnapshotYaml(url);
  return deserializeSnapshot(yaml);
}
