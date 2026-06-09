import { parse, stringify } from "yaml";
import { createDefaultWorkspaceInternalTools } from "@/internal-tools/pomodoro";
import type { FocusTask, PomodoroState } from "@/internal-tools/types";
import { validateLibrary } from "@/library/library";
import type {
  EdgeGroup,
  EdgeGroupLinkPlacement,
  Library,
  Link,
  ShortcutBindings,
  Theme,
  Workspace,
  WorkspacePlacements,
} from "@/library/types";

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
    pins: SnapshotPin[];
  };
  internalTools?: {
    pomodoro: PomodoroState;
    tasks: FocusTask[];
  };
};

export type LibrarySnapshot = {
  version: typeof SNAPSHOT_VERSION;
  catalog: Link[];
  workspaces: SnapshotWorkspace[];
  shortcuts: ShortcutBindings;
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

function pinToSnapshot(pin: WorkspacePlacements["pins"][number]): SnapshotPin {
  if (pin.position.kind === "strip") {
    return {
      linkId: pin.linkId,
      position: "strip",
      order: pin.position.orderKey,
    };
  }

  return {
    linkId: pin.linkId,
    position: { x: pin.position.x, y: pin.position.y },
  };
}

function snapshotPinToLibrary(pin: SnapshotPin): WorkspacePlacements["pins"][number] {
  if (pin.position === "strip") {
    return {
      linkId: pin.linkId,
      position: { kind: "strip", orderKey: pin.order },
    };
  }

  return {
    linkId: pin.linkId,
    position: { kind: "freeform", x: pin.position.x, y: pin.position.y },
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
        pins: workspace.placements.pins.map(pinToSnapshot),
      },
      internalTools: workspace.internalTools,
    })),
    shortcuts: { ...library.shortcuts },
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
    workspaces: snapshot.workspaces.map(
      (workspace): Workspace => ({
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
          edges: {
            left: workspace.placements.edgeGroups.left.map(snapshotEdgeGroupToLibrary),
            top: workspace.placements.edgeGroups.top.map(snapshotEdgeGroupToLibrary),
            bottom: workspace.placements.edgeGroups.bottom.map(snapshotEdgeGroupToLibrary),
          },
          pins: workspace.placements.pins.map(snapshotPinToLibrary),
        },
        internalTools:
          workspace.internalTools ?? createDefaultWorkspaceInternalTools(),
      }),
    ),
    shortcuts: { ...snapshot.shortcuts },
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
