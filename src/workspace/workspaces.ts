import { createDefaultWorkspaceInternalTools } from "@/internal-tools/pomodoro";
import { createDefaultCanvasWidgets } from "@/canvas-widgets/config";
import type { Library, Theme, Workspace, WorkspacePlacements } from "@/library/types";

export const DEFAULT_WORKSPACE_THEME: Theme = {
  palette: {
    background: "#f5f0e8",
    surface: "#fffdf9",
    text: "#2c2419",
    accent: "#c17f59",
  },
  glassOpacity: 0.72,
  borderRadius: 20,
};

const EMPTY_PLACEMENTS: WorkspacePlacements = {
  edges: { left: [], top: [], bottom: [] },
  pins: [],
};

function createWorkspaceId(): string {
  return crypto.randomUUID();
}

export function createWorkspace(library: Library, name: string): Library {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Workspace name is required");
  }

  const workspace: Workspace = {
    id: createWorkspaceId(),
    name: trimmed,
    theme: {
      ...DEFAULT_WORKSPACE_THEME,
      palette: { ...DEFAULT_WORKSPACE_THEME.palette },
    },
    placements: EMPTY_PLACEMENTS,
    internalTools: createDefaultWorkspaceInternalTools(),
    canvasWidgets: createDefaultCanvasWidgets(),
  };

  return {
    ...library,
    workspaces: [...library.workspaces, workspace],
  };
}

export function renameWorkspace(
  library: Library,
  workspaceId: string,
  name: string,
): Library {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Workspace name is required");
  }

  if (!library.workspaces.some((workspace) => workspace.id === workspaceId)) {
    throw new Error(`Workspace "${workspaceId}" not found`);
  }

  return {
    ...library,
    workspaces: library.workspaces.map((workspace) =>
      workspace.id === workspaceId ? { ...workspace, name: trimmed } : workspace,
    ),
  };
}

export function deleteWorkspace(library: Library, workspaceId: string): Library {
  if (!library.workspaces.some((workspace) => workspace.id === workspaceId)) {
    throw new Error(`Workspace "${workspaceId}" not found`);
  }

  if (library.workspaces.length <= 1) {
    throw new Error("Cannot delete the last workspace");
  }

  const workspaces = library.workspaces.filter((workspace) => workspace.id !== workspaceId);
  const activeWorkspaceId =
    library.activeWorkspaceId === workspaceId ? workspaces[0].id : library.activeWorkspaceId;

  return {
    ...library,
    workspaces,
    activeWorkspaceId,
  };
}
