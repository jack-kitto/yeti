import type { Library, Workspace } from "@/library/types";
import { ensureLibraryCanvasWidgets } from "@/canvas-widgets/defaults";
import { ensureLibraryFocusRadio } from "@/focus-radio/defaults";
import { normalizeWorkspacePlacementsInLibrary } from "@/library/migrate-placements";
import { createDefaultWorkspaceInternalTools } from "./pomodoro";

export function ensureWorkspaceInternalTools(workspace: Workspace): Workspace {
  if (workspace.internalTools) {
    return workspace;
  }

  return {
    ...workspace,
    internalTools: createDefaultWorkspaceInternalTools(),
  };
}

export function ensureLibraryDefaults(library: Library): Library {
  const normalized = normalizeWorkspacePlacementsInLibrary(library);

  return ensureLibraryFocusRadio(
    ensureLibraryCanvasWidgets({
      ...library,
      ...normalized,
      workspaces: normalized.workspaces.map(ensureWorkspaceInternalTools),
    }),
  );
}
