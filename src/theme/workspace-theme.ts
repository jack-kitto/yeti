import type { Library, Theme, ThemePatch } from "@/library/types";

function applyThemePatch(theme: Theme, patch: ThemePatch): Theme {
  const next: Theme = {
    ...theme,
    palette: {
      ...theme.palette,
      ...(patch.palette ?? {}),
    },
    ...(patch.glassOpacity !== undefined ? { glassOpacity: patch.glassOpacity } : {}),
    ...(patch.borderRadius !== undefined ? { borderRadius: patch.borderRadius } : {}),
  };

  if (patch.backgroundUrl === null) {
    const { backgroundUrl: _removed, ...withoutBackground } = next;
    return withoutBackground;
  }

  if (patch.backgroundUrl !== undefined) {
    const trimmed = patch.backgroundUrl.trim();
    return trimmed ? { ...next, backgroundUrl: trimmed } : { ...next, backgroundUrl: undefined };
  }

  return next;
}

export function updateWorkspaceTheme(
  library: Library,
  workspaceId: string,
  patch: ThemePatch,
): Library {
  if (!library.workspaces.some((workspace) => workspace.id === workspaceId)) {
    throw new Error(`Workspace "${workspaceId}" not found`);
  }

  return {
    ...library,
    workspaces: library.workspaces.map((workspace) =>
      workspace.id === workspaceId
        ? { ...workspace, theme: applyThemePatch(workspace.theme, patch) }
        : workspace,
    ),
  };
}
