import type { CanvasWidgetId } from "@/canvas-widgets/types";
import type { CanvasWidgetStyle, Workspace } from "@/library/types";
import { resolveTheme } from "./theme-defaults";

export const LAYOUT_PRESET_IDS = ["default", "editorial"] as const;

export type LayoutPresetId = (typeof LAYOUT_PRESET_IDS)[number];

type WidgetLayout = Pick<CanvasWidgetStyle, "zone" | "order">;

export type LayoutPreset = {
  id: LayoutPresetId;
  name: string;
  widgets: Record<CanvasWidgetId, WidgetLayout>;
};

const DEFAULT_WIDGET_LAYOUT: Record<CanvasWidgetId, WidgetLayout> = {
  clock: { zone: "upper-center", order: 0 },
  welcome: { zone: "center", order: 0 },
  quote: { zone: "center", order: 1 },
  nowPlaying: { zone: "bottom-center", order: 0 },
  focusTasks: { zone: "lower-right", order: 0 },
  pomodoro: { zone: "center", order: 0 },
};

export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: "default",
    name: "Default",
    widgets: DEFAULT_WIDGET_LAYOUT,
  },
  {
    id: "editorial",
    name: "Editorial",
    widgets: {
      quote: { zone: "lower-left", order: 0 },
      nowPlaying: { zone: "lower-left", order: 1 },
      focusTasks: { zone: "lower-right", order: 0 },
      welcome: { zone: "bottom-center", order: 0 },
      clock: { zone: "bottom-center", order: 1 },
      pomodoro: { zone: "center", order: 0 },
    },
  },
];

const presetById = new Map(LAYOUT_PRESETS.map((preset) => [preset.id, preset]));

export function isLayoutPresetId(id: string): id is LayoutPresetId {
  return (LAYOUT_PRESET_IDS as readonly string[]).includes(id);
}

export function getLayoutPreset(id: LayoutPresetId): LayoutPreset | undefined {
  return presetById.get(id);
}

export function applyLayoutPreset(workspace: Workspace, presetId: LayoutPresetId): Workspace {
  const preset = getLayoutPreset(presetId);
  if (!preset) {
    throw new Error(`Unknown layout preset "${presetId}"`);
  }

  const resolved = resolveTheme(workspace.theme);
  const widgets = { ...resolved.widgets };

  for (const widgetId of Object.keys(preset.widgets) as CanvasWidgetId[]) {
    widgets[widgetId] = {
      ...widgets[widgetId],
      ...preset.widgets[widgetId],
    };
  }

  return {
    ...workspace,
    theme: {
      ...workspace.theme,
      widgets,
      appliedLayoutPresetId: presetId,
    },
  };
}
