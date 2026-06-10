import { describe, expect, it } from "vitest";
import { createDefaultCanvasWidgets } from "@/canvas-widgets/config";
import { createTestTheme } from "./theme-defaults";
import {
  THEME_PRESETS,
  applyThemePreset,
  getThemePreset,
} from "./theme-presets";

describe("theme preset catalog", () => {
  it("ships six named presets including Work and Personal", () => {
    expect(THEME_PRESETS).toHaveLength(6);
    expect(THEME_PRESETS.map((preset) => preset.id)).toEqual([
      "work",
      "personal",
      "midnight",
      "forest",
      "sunset",
      "ocean",
    ]);
    expect(THEME_PRESETS.map((preset) => preset.name)).toEqual([
      "Work",
      "Personal",
      "Midnight",
      "Forest",
      "Sunset",
      "Ocean",
    ]);
  });

  it("each preset defines a complete theme with per-widget styling", () => {
    for (const preset of THEME_PRESETS) {
      expect(preset.theme.palette.background).toMatch(/^#/);
      expect(preset.theme.shellSurface).toBeTruthy();
      expect(preset.theme.widgets.clock?.text).toMatch(/^#/);
      expect(preset.theme.widgets.welcome?.zone).toBeTruthy();
    }
  });
});

describe("applyThemePreset", () => {
  it("copies preset theme fields and sets appliedPresetId", () => {
    const workspace = {
      id: "ws-1",
      name: "Test",
      theme: createTestTheme({ palette: { background: "#000000", surface: "#111111", text: "#ffffff", accent: "#ff0000" } }),
      placements: { edges: { left: [], top: [], bottom: [] } },
      internalTools: {} as never,
      canvasWidgets: createDefaultCanvasWidgets(),
    };
    workspace.canvasWidgets.clock = false;

    const preset = getThemePreset("forest")!;
    const updated = applyThemePreset(workspace, "forest");

    expect(updated.theme.appliedPresetId).toBe("forest");
    expect(updated.theme.palette).toEqual(preset.theme.palette);
    expect(updated.theme.shellSurface).toBe(preset.theme.shellSurface);
    expect(updated.theme.backgroundUrl).toBe(preset.theme.backgroundUrl);
    expect(updated.theme.glassOpacity).toBe(preset.theme.glassOpacity);
    expect(updated.theme.borderRadius).toBe(preset.theme.borderRadius);
    expect(updated.theme.widgets).toEqual(preset.theme.widgets);
    expect(updated.canvasWidgets.clock).toBe(false);
  });
});
