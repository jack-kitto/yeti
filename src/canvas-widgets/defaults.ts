import type { Library, Workspace } from "@/library/types";
import { createDefaultCanvasWidgets } from "./config";

export function ensureWorkspaceCanvasWidgets(workspace: Workspace): Workspace {
  if (workspace.canvasWidgets) {
    return workspace;
  }

  return {
    ...workspace,
    canvasWidgets: createDefaultCanvasWidgets(),
  };
}

export function ensureLibraryCanvasWidgets(library: Library): Library {
  return {
    ...library,
    workspaces: library.workspaces.map(ensureWorkspaceCanvasWidgets),
  };
}
