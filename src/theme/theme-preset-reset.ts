import type { CanvasWidgetId } from "@/canvas-widgets/types";
import type { ThemePatch, Workspace } from "@/library/types";
import { getThemePreset, isThemePresetId } from "./theme-presets";

export function resetShellThemeToPreset(workspace: Workspace): ThemePatch | null {
  const presetId = workspace.theme.appliedPresetId;
  if (!presetId || !isThemePresetId(presetId)) {
    return null;
  }

  const preset = getThemePreset(presetId);
  if (!preset) {
    return null;
  }

  return {
    palette: { ...preset.theme.palette },
    shellSurface: preset.theme.shellSurface,
    ...(preset.theme.shellBorderColor
      ? { shellBorderColor: preset.theme.shellBorderColor }
      : { shellBorderColor: null }),
    glassOpacity: preset.theme.glassOpacity,
    borderRadius: preset.theme.borderRadius,
    backgroundUrl: preset.theme.backgroundUrl,
  };
}

export function resetWidgetThemeToPreset(
  workspace: Workspace,
  widgetId: CanvasWidgetId,
): ThemePatch | null {
  const presetId = workspace.theme.appliedPresetId;
  if (!presetId || !isThemePresetId(presetId)) {
    return null;
  }

  const preset = getThemePreset(presetId);
  const widgetStyle = preset?.theme.widgets[widgetId];
  if (!widgetStyle) {
    return null;
  }

  return {
    widgets: {
      [widgetId]: { ...widgetStyle },
    },
  };
}
