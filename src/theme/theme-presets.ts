import type { CanvasWidgetId } from "@/canvas-widgets/types";
import type { CanvasWidgetStyle, ShellSurface, Theme, ThemePalette, Workspace } from "@/library/types";

export const THEME_PRESET_IDS = [
  "work",
  "personal",
  "editorial",
  "forest",
  "sunset",
  "ocean",
] as const;

export type ThemePresetId = (typeof THEME_PRESET_IDS)[number];

export type ThemePreset = {
  id: ThemePresetId;
  name: string;
  theme: Omit<Theme, "appliedPresetId">;
};

type PresetWidgetStyles = Record<CanvasWidgetId, CanvasWidgetStyle>;

function widgets(styles: PresetWidgetStyles): PresetWidgetStyles {
  return styles;
}

function createPresetTheme(
  palette: ThemePalette,
  options: {
    shellSurface: ShellSurface;
    backgroundUrl: string;
    glassOpacity: number;
    borderRadius?: number;
    widgets: PresetWidgetStyles;
  },
): Omit<Theme, "appliedPresetId"> {
  return {
    palette,
    shellSurface: options.shellSurface,
    backgroundUrl: options.backgroundUrl,
    glassOpacity: options.glassOpacity,
    borderRadius: options.borderRadius ?? 20,
    widgets: options.widgets,
  };
}

const workPalette: ThemePalette = {
  background: "#f5f0e8",
  surface: "#fffdf9",
  text: "#2c2419",
  accent: "#c17f59",
};

const personalPalette: ThemePalette = {
  background: "#1a1d24",
  surface: "#252a33",
  text: "#e8e6e3",
  accent: "#7eb8da",
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "work",
    name: "Work",
    theme: createPresetTheme(workPalette, {
      shellSurface: "glass",
      backgroundUrl: "https://images.unsplash.com/photo-1497215728101-856f1ea4214f?w=1920",
      glassOpacity: 0.72,
      widgets: widgets({
        clock: {
          zone: "upper-center",
          order: 0,
          text: "#1f1a14",
          textMuted: "#5c4f42",
          textShadow: "0 1px 10px rgba(255, 252, 245, 0.75)",
        },
        welcome: {
          zone: "center",
          order: 0,
          text: "#2c2419",
          textMuted: "#6b5d4d",
          textShadow: "0 2px 16px rgba(255, 252, 245, 0.65)",
        },
        quote: {
          zone: "center",
          order: 1,
          text: "#3d3428",
          textMuted: "#7a6b58",
          textShadow: "0 1px 12px rgba(255, 252, 245, 0.6)",
        },
        nowPlaying: {
          zone: "bottom-center",
          order: 0,
          text: "#2c2419",
          textMuted: "#6b5d4d",
          textShadow: "0 1px 8px rgba(255, 252, 245, 0.7)",
        },
        focusTasks: {
          zone: "lower-right",
          order: 0,
          text: "#2c2419",
          textMuted: "#6b5d4d",
          textShadow: "0 1px 10px rgba(255, 252, 245, 0.65)",
        },
        pomodoro: {
          zone: "center",
          order: 0,
          text: "#2c2419",
          textMuted: "#6b5d4d",
          textShadow: "0 2px 14px rgba(255, 252, 245, 0.6)",
        },
      }),
    }),
  },
  {
    id: "personal",
    name: "Personal",
    theme: createPresetTheme(personalPalette, {
      shellSurface: "glass",
      backgroundUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920",
      glassOpacity: 0.65,
      widgets: widgets({
        clock: {
          zone: "upper-center",
          order: 0,
          text: "#f4f2ef",
          textMuted: "#b8b4ae",
          textShadow: "0 2px 12px rgba(0, 0, 0, 0.55)",
        },
        welcome: {
          zone: "center",
          order: 0,
          text: "#ffffff",
          textMuted: "#c5c2bc",
          textShadow: "0 2px 20px rgba(0, 0, 0, 0.6)",
        },
        quote: {
          zone: "center",
          order: 1,
          text: "#e8e6e3",
          textMuted: "#a8a49c",
          textShadow: "0 2px 16px rgba(0, 0, 0, 0.5)",
        },
        nowPlaying: {
          zone: "bottom-center",
          order: 0,
          text: "#f0eeeb",
          textMuted: "#b0aca4",
          textShadow: "0 1px 10px rgba(0, 0, 0, 0.55)",
        },
        focusTasks: {
          zone: "lower-right",
          order: 0,
          text: "#f0eeeb",
          textMuted: "#a8a49c",
          textShadow: "0 1px 12px rgba(0, 0, 0, 0.5)",
        },
        pomodoro: {
          zone: "center",
          order: 0,
          text: "#ffffff",
          textMuted: "#b8b4ae",
          textShadow: "0 2px 18px rgba(0, 0, 0, 0.55)",
        },
      }),
    }),
  },
  {
    id: "editorial",
    name: "Editorial",
    theme: createPresetTheme(
      {
        background: "#ffffff",
        surface: "#ffffff",
        text: "#000000",
        accent: "#000000",
      },
      {
        shellSurface: "solid",
        backgroundUrl: "",
        glassOpacity: 1,
        borderRadius: 0,
        widgets: widgets({
          quote: {
            zone: "upper-center",
            order: 0,
            text: "#000000",
            textMuted: "#666666",
            textShadow: "none",
          },
          focusTasks: {
            zone: "lower-right",
            order: 0,
            text: "#000000",
            textMuted: "#666666",
            textShadow: "none",
          },
          welcome: {
            zone: "lower-left",
            order: 0,
            text: "#000000",
            textMuted: "#666666",
            textShadow: "none",
          },
          clock: {
            zone: "lower-left",
            order: 1,
            text: "#000000",
            textMuted: "#666666",
            textShadow: "none",
          },
          nowPlaying: {
            zone: "bottom-center",
            order: 0,
            text: "#000000",
            textMuted: "#666666",
            textShadow: "none",
          },
          pomodoro: {
            zone: "center",
            order: 0,
            text: "#000000",
            textMuted: "#666666",
            textShadow: "none",
          },
        }),
      },
    ),
  },
  {
    id: "forest",
    name: "Forest",
    theme: createPresetTheme(
      {
        background: "#1a2e1f",
        surface: "#243828",
        text: "#e8f0e4",
        accent: "#6b9b6e",
      },
      {
        shellSurface: "glass",
        backgroundUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920",
        glassOpacity: 0.68,
        widgets: widgets({
          clock: {
            zone: "upper-center",
            order: 0,
            text: "#f5faf2",
            textMuted: "#b8cdb0",
            textShadow: "0 2px 12px rgba(0, 0, 0, 0.5)",
          },
          welcome: {
            zone: "center",
            order: 0,
            text: "#ffffff",
            textMuted: "#c5d8bc",
            textShadow: "0 2px 20px rgba(0, 0, 0, 0.55)",
          },
          quote: {
            zone: "center",
            order: 1,
            text: "#e8f0e4",
            textMuted: "#a8bf9e",
            textShadow: "0 2px 14px rgba(0, 0, 0, 0.45)",
          },
          nowPlaying: {
            zone: "bottom-center",
            order: 0,
            text: "#f0f6ec",
            textMuted: "#b0c4a6",
            textShadow: "0 1px 10px rgba(0, 0, 0, 0.5)",
          },
          focusTasks: {
            zone: "lower-right",
            order: 0,
            text: "#e8f0e4",
            textMuted: "#a8bf9e",
            textShadow: "0 1px 12px rgba(0, 0, 0, 0.45)",
          },
          pomodoro: {
            zone: "lower-left",
            order: 0,
            text: "#ffffff",
            textMuted: "#b8cdb0",
            textShadow: "0 2px 16px rgba(0, 0, 0, 0.5)",
          },
        }),
      },
    ),
  },
  {
    id: "sunset",
    name: "Sunset",
    theme: createPresetTheme(
      {
        background: "#2a1810",
        surface: "#3d2418",
        text: "#fce8d8",
        accent: "#e87c4a",
      },
      {
        shellSurface: "transparent",
        backgroundUrl: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920",
        glassOpacity: 0.45,
        widgets: widgets({
          clock: {
            zone: "upper-center",
            order: 0,
            text: "#fff8f0",
            textMuted: "#e8c4a8",
            textShadow: "0 2px 14px rgba(0, 0, 0, 0.6)",
          },
          welcome: {
            zone: "center",
            order: 0,
            text: "#ffffff",
            textMuted: "#f0c9a8",
            textShadow: "0 2px 22px rgba(0, 0, 0, 0.65)",
          },
          quote: {
            zone: "center",
            order: 1,
            text: "#fce8d8",
            textMuted: "#d4a888",
            textShadow: "0 2px 16px rgba(0, 0, 0, 0.55)",
          },
          nowPlaying: {
            zone: "bottom-center",
            order: 0,
            text: "#fff4e8",
            textMuted: "#e0b898",
            textShadow: "0 1px 12px rgba(0, 0, 0, 0.55)",
          },
          focusTasks: {
            zone: "lower-right",
            order: 0,
            text: "#fce8d8",
            textMuted: "#d4a888",
            textShadow: "0 1px 14px rgba(0, 0, 0, 0.5)",
          },
          pomodoro: {
            zone: "lower-left",
            order: 0,
            text: "#ffffff",
            textMuted: "#e8c4a8",
            textShadow: "0 2px 18px rgba(0, 0, 0, 0.6)",
          },
        }),
      },
    ),
  },
  {
    id: "ocean",
    name: "Ocean",
    theme: createPresetTheme(
      {
        background: "#0c1a2e",
        surface: "#152640",
        text: "#d8e8f4",
        accent: "#4a9fd4",
      },
      {
        shellSurface: "glass",
        backgroundUrl: "https://images.unsplash.com/photo-1505142468610-359e7f316be0?w=1920",
        glassOpacity: 0.7,
        widgets: widgets({
          clock: {
            zone: "upper-center",
            order: 0,
            text: "#f0f8ff",
            textMuted: "#9cb8d4",
            textShadow: "0 2px 14px rgba(0, 0, 0, 0.55)",
          },
          welcome: {
            zone: "center",
            order: 0,
            text: "#ffffff",
            textMuted: "#a8c4dc",
            textShadow: "0 2px 22px rgba(0, 0, 0, 0.6)",
          },
          quote: {
            zone: "center",
            order: 1,
            text: "#d8e8f4",
            textMuted: "#88aac8",
            textShadow: "0 2px 16px rgba(0, 0, 0, 0.5)",
          },
          nowPlaying: {
            zone: "bottom-center",
            order: 0,
            text: "#e8f4fc",
            textMuted: "#98b8d0",
            textShadow: "0 1px 12px rgba(0, 0, 0, 0.5)",
          },
          focusTasks: {
            zone: "lower-right",
            order: 0,
            text: "#d8e8f4",
            textMuted: "#88aac8",
            textShadow: "0 1px 14px rgba(0, 0, 0, 0.45)",
          },
          pomodoro: {
            zone: "upper-center",
            order: 1,
            text: "#ffffff",
            textMuted: "#9cb8d4",
            textShadow: "0 2px 18px rgba(0, 0, 0, 0.55)",
          },
        }),
      },
    ),
  },
];

const presetById = new Map(THEME_PRESETS.map((preset) => [preset.id, preset]));

export function getThemePreset(id: ThemePresetId): ThemePreset | undefined {
  return presetById.get(id);
}

export function applyThemePreset(workspace: Workspace, presetId: ThemePresetId): Workspace {
  const preset = getThemePreset(presetId);
  if (!preset) {
    throw new Error(`Unknown theme preset "${presetId}"`);
  }

  return {
    ...workspace,
    theme: {
      ...preset.theme,
      appliedPresetId: presetId,
    },
  };
}
