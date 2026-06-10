import type { Library, Theme, ThemePalette, ThemePatch } from "@/library/types";

function trackPaletteOverrides(
  theme: Theme,
  palettePatch: Partial<ThemePalette>,
): Partial<ThemePalette> | undefined {
  const overrides: Partial<ThemePalette> = { ...theme.paletteOverrides };

  for (const key of Object.keys(palettePatch) as (keyof ThemePalette)[]) {
    const value = palettePatch[key];
    if (value !== undefined) {
      overrides[key] = value;
    }
  }

  return Object.keys(overrides).length > 0 ? overrides : undefined;
}

function applyThemePatch(theme: Theme, patch: ThemePatch): Theme {
  let next: Theme = {
    ...theme,
    palette: {
      ...theme.palette,
      ...(patch.palette ?? {}),
    },
    ...(patch.glassOpacity !== undefined ? { glassOpacity: patch.glassOpacity } : {}),
    ...(patch.borderRadius !== undefined ? { borderRadius: patch.borderRadius } : {}),
  };

  if (patch.palette && patch.recordPaletteOverrides !== false) {
    const overrides = trackPaletteOverrides(theme, patch.palette);
    if (overrides) {
      next = { ...next, paletteOverrides: overrides };
    }
  }

  if (patch.paletteExtractedFromUrl === null) {
    const { paletteExtractedFromUrl: _removed, ...withoutMarker } = next;
    next = withoutMarker;
  } else if (patch.paletteExtractedFromUrl !== undefined) {
    next = { ...next, paletteExtractedFromUrl: patch.paletteExtractedFromUrl };
  }

  if (patch.backgroundUrl === null) {
    const {
      backgroundUrl: _backgroundUrl,
      paletteExtractedFromUrl: _paletteExtractedFromUrl,
      ...withoutBackground
    } = next;
    return withoutBackground;
  }

  if (patch.backgroundUrl !== undefined) {
    const trimmed = patch.backgroundUrl.trim();
    const nextBackgroundUrl = trimmed || undefined;
    const backgroundChanged = nextBackgroundUrl !== theme.backgroundUrl;

    next = trimmed ? { ...next, backgroundUrl: trimmed } : { ...next, backgroundUrl: undefined };

    if (backgroundChanged) {
      const { paletteExtractedFromUrl: _paletteExtractedFromUrl, ...withoutMarker } = next;
      next = withoutMarker;
    }
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
