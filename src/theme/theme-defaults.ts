import type { CanvasWidgetId } from "@/canvas-widgets/types";
import type {
  CanvasWidgetStyle,
  ShellSurface,
  Theme,
  ThemePalette,
} from "@/library/types";

export const DEFAULT_SHELL_SURFACE: ShellSurface = "glass";

const WIDGET_LAYOUT: Record<CanvasWidgetId, Pick<CanvasWidgetStyle, "zone" | "order">> = {
  clock: { zone: "upper-center", order: 0 },
  welcome: { zone: "center", order: 0 },
  quote: { zone: "center", order: 1 },
  nowPlaying: { zone: "bottom-center", order: 0 },
  focusTasks: { zone: "lower-right", order: 0 },
  pomodoro: { zone: "center", order: 0 },
};

export function createWidgetStyle(
  palette: ThemePalette,
  widgetId: CanvasWidgetId,
): CanvasWidgetStyle {
  const layout = WIDGET_LAYOUT[widgetId];
  return {
    ...layout,
    text: palette.text,
    textMuted: palette.text,
    textShadow: "none",
  };
}

export function createDefaultWidgetStyles(
  palette: ThemePalette,
): Record<CanvasWidgetId, CanvasWidgetStyle> {
  return {
    clock: createWidgetStyle(palette, "clock"),
    welcome: createWidgetStyle(palette, "welcome"),
    quote: createWidgetStyle(palette, "quote"),
    nowPlaying: createWidgetStyle(palette, "nowPlaying"),
    pomodoro: createWidgetStyle(palette, "pomodoro"),
    focusTasks: createWidgetStyle(palette, "focusTasks"),
  };
}

export type ResolvedTheme = Theme & {
  shellSurface: ShellSurface;
  widgets: Record<CanvasWidgetId, CanvasWidgetStyle>;
};

export function resolveTheme(theme: Theme): ResolvedTheme {
  return {
    ...theme,
    shellSurface: theme.shellSurface ?? DEFAULT_SHELL_SURFACE,
    widgets: {
      ...createDefaultWidgetStyles(theme.palette),
      ...theme.widgets,
    },
  };
}

const TEST_PALETTE: ThemePalette = {
  background: "#101010",
  surface: "#202020",
  text: "#f5f5f5",
  accent: "#ff5500",
};

export function createTestTheme(overrides: Partial<Theme> = {}): Theme {
  const palette = { ...TEST_PALETTE, ...overrides.palette };
  const { palette: _palette, ...rest } = overrides;
  return resolveTheme({
    shellSurface: DEFAULT_SHELL_SURFACE,
    glassOpacity: 0.7,
    borderRadius: 20,
    widgets: {},
    ...rest,
    palette,
  });
}
