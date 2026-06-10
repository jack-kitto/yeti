import { describe, expect, it, vi } from "vitest";
import type { Theme, ThemePalette } from "@/library/types";

const { warmOfficeColors } = vi.hoisted(() => ({
  warmOfficeColors: [
    { hex: "#f5f0e8", lightness: 0.94, saturation: 0.12, area: 0.42 },
    { hex: "#fffdf9", lightness: 0.99, saturation: 0.05, area: 0.18 },
    { hex: "#2c2419", lightness: 0.16, saturation: 0.22, area: 0.08 },
    { hex: "#c17f59", lightness: 0.52, saturation: 0.68, area: 0.06 },
  ],
}));

vi.mock("extract-colors", () => ({
  extractColors: vi.fn().mockResolvedValue(warmOfficeColors),
}));

/* eslint-disable import-x/first -- vi.mock must run before the module under test is imported */
import {
  applyExtractedPaletteToTheme,
  contrastRatio,
  ensureCanvasTextContrast,
  extractPaletteFromImageUrl,
  mapExtractedColorsToPalette,
  mergeExtractedPalette,
  MIN_CANVAS_TEXT_CONTRAST_RATIO,
  needsPaletteExtraction,
} from "./palette-extraction";
/* eslint-enable import-x/first */

describe("mapExtractedColorsToPalette", () => {
  it("maps dominant colors to all four palette tokens", () => {
    expect(mapExtractedColorsToPalette(warmOfficeColors)).toEqual({
      background: "#f5f0e8",
      surface: "#fffdf9",
      text: "#2c2419",
      accent: "#c17f59",
    });
  });

  it("throws when no colors are provided", () => {
    expect(() => mapExtractedColorsToPalette([])).toThrow(/no colors/i);
  });
});

describe("mergeExtractedPalette", () => {
  const extracted: ThemePalette = {
    background: "#111111",
    surface: "#222222",
    text: "#eeeeee",
    accent: "#ff5500",
  };

  it("uses extracted values when there are no overrides", () => {
    expect(mergeExtractedPalette(extracted)).toEqual(extracted);
  });

  it("keeps manual overrides for edited tokens only", () => {
    expect(
      mergeExtractedPalette(extracted, {
        accent: "#00ff00",
      }),
    ).toEqual({
      background: "#111111",
      surface: "#222222",
      text: "#eeeeee",
      accent: "#00ff00",
    });
  });
});

describe("needsPaletteExtraction", () => {
  it("is true when a background URL has not been extracted yet", () => {
    const theme: Theme = {
      palette: {
        background: "#000",
        surface: "#111",
        text: "#fff",
        accent: "#f00",
      },
      backgroundUrl: "https://example.com/bg.jpg",
      glassOpacity: 0.7,
      borderRadius: 12,
    };

    expect(needsPaletteExtraction(theme)).toBe(true);
  });

  it("is false when palette was already extracted for the current URL", () => {
    const theme: Theme = {
      palette: {
        background: "#000",
        surface: "#111",
        text: "#fff",
        accent: "#f00",
      },
      backgroundUrl: "https://example.com/bg.jpg",
      paletteExtractedFromUrl: "https://example.com/bg.jpg",
      glassOpacity: 0.7,
      borderRadius: 12,
    };

    expect(needsPaletteExtraction(theme)).toBe(false);
  });

  it("is false when there is no background image URL", () => {
    const theme: Theme = {
      palette: {
        background: "#000",
        surface: "#111",
        text: "#fff",
        accent: "#f00",
      },
      glassOpacity: 0.7,
      borderRadius: 12,
    };

    expect(needsPaletteExtraction(theme)).toBe(false);
  });
});

describe("applyExtractedPaletteToTheme", () => {
  it("records the source URL and respects palette overrides", () => {
    const theme: Theme = {
      palette: {
        background: "#000",
        surface: "#111",
        text: "#fff",
        accent: "#f00",
      },
      backgroundUrl: "https://example.com/bg.jpg",
      paletteOverrides: { accent: "#00ff00" },
      glassOpacity: 0.7,
      borderRadius: 12,
    };

    const extracted: ThemePalette = {
      background: "#222222",
      surface: "#333333",
      text: "#eeeeee",
      accent: "#ff5500",
    };

    expect(applyExtractedPaletteToTheme(theme, extracted)).toEqual({
      ...theme,
      palette: {
        background: "#222222",
        surface: "#333333",
        text: "#eeeeee",
        accent: "#00ff00",
      },
      paletteExtractedFromUrl: "https://example.com/bg.jpg",
    });
  });
});

describe("extractPaletteFromImageUrl", () => {
  it("extracts palette from an image URL via extract-colors", async () => {
    await expect(extractPaletteFromImageUrl("https://example.com/bg.jpg")).resolves.toEqual({
      background: "#f5f0e8",
      surface: "#fffdf9",
      text: "#2c2419",
      accent: "#c17f59",
    });
  });
});

describe("canvas text contrast", () => {
  const muddyMountainColors = [
    { hex: "#8f9aa6", lightness: 0.62, saturation: 0.08, area: 0.44 },
    { hex: "#7a8794", lightness: 0.54, saturation: 0.1, area: 0.28 },
    { hex: "#6d7884", lightness: 0.48, saturation: 0.09, area: 0.14 },
    { hex: "#9aa5b0", lightness: 0.66, saturation: 0.07, area: 0.08 },
    { hex: "#5f6872", lightness: 0.42, saturation: 0.08, area: 0.06 },
  ];

  it("enforces the documented minimum contrast ratio for canvas text", () => {
    const palette = mapExtractedColorsToPalette(muddyMountainColors);

    expect(contrastRatio(palette.text, palette.background)).toBeGreaterThanOrEqual(
      MIN_CANVAS_TEXT_CONTRAST_RATIO,
    );
  });

  it("pushes low-contrast extracted text toward readable extremes", () => {
    const adjusted = ensureCanvasTextContrast("#7a8794", "#8f9aa6");

    expect(contrastRatio(adjusted, "#8f9aa6")).toBeGreaterThanOrEqual(
      MIN_CANVAS_TEXT_CONTRAST_RATIO,
    );
    expect(adjusted).not.toBe("#7a8794");
  });

  it("keeps starter work palette text readable on its extracted background", () => {
    const palette = mapExtractedColorsToPalette(warmOfficeColors);

    expect(contrastRatio(palette.text, palette.background)).toBeGreaterThanOrEqual(
      MIN_CANVAS_TEXT_CONTRAST_RATIO,
    );
  });
});
