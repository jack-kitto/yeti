import { extractColors } from "extract-colors";
import type { Theme, ThemePalette } from "@/library/types";

export type ExtractedColor = {
  hex: string;
  lightness: number;
  saturation: number;
  area: number;
};

function normalizeHex(hex: string): string {
  const trimmed = hex.trim().toLowerCase();
  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
}

export function mapExtractedColorsToPalette(colors: ExtractedColor[]): ThemePalette {
  if (colors.length === 0) {
    throw new Error("No colors extracted from image");
  }

  const sorted = [...colors].sort((left, right) => right.area - left.area);

  let background = sorted.find((color) => color.lightness >= 0.45);
  if (!background) {
    background = sorted[0];
    for (const color of sorted) {
      if (color.lightness > background.lightness) {
        background = color;
      }
    }
  }

  const textCandidates = sorted.filter((color) => color.hex !== background.hex);
  let text = textCandidates.find((color) => color.lightness <= 0.4);
  if (!text) {
    text = textCandidates[0] ?? background;
    for (const color of textCandidates) {
      if (color.lightness < text.lightness) {
        text = color;
      }
    }
  }

  const accentCandidates = sorted.filter(
    (color) =>
      color.hex !== background.hex &&
      color.hex !== text.hex &&
      color.lightness >= 0.2 &&
      color.lightness <= 0.8 &&
      color.saturation >= 0.15,
  );
  let accent = accentCandidates[0];
  if (accent) {
    for (const color of accentCandidates) {
      if (color.saturation > accent.saturation) {
        accent = color;
      }
    }
  } else {
    accent =
      sorted.find((color) => color.hex !== background.hex && color.hex !== text.hex) ?? background;
  }

  const surfaceCandidates = sorted.filter(
    (color) =>
      color.hex !== background.hex &&
      color.hex !== text.hex &&
      color.hex !== accent.hex &&
      color.lightness >= background.lightness - 0.05,
  );
  const surface =
    surfaceCandidates.find((color) => color.lightness > background.lightness) ??
    surfaceCandidates[0] ??
    background;

  return {
    background: normalizeHex(background.hex),
    surface: normalizeHex(surface.hex),
    text: normalizeHex(text.hex),
    accent: normalizeHex(accent.hex),
  };
}

export function mergeExtractedPalette(
  extracted: ThemePalette,
  overrides?: Partial<ThemePalette>,
): ThemePalette {
  return {
    background: overrides?.background ?? extracted.background,
    surface: overrides?.surface ?? extracted.surface,
    text: overrides?.text ?? extracted.text,
    accent: overrides?.accent ?? extracted.accent,
  };
}

export function needsPaletteExtraction(theme: Theme): boolean {
  if (!theme.backgroundUrl) {
    return false;
  }

  return theme.paletteExtractedFromUrl !== theme.backgroundUrl;
}

export function applyExtractedPaletteToTheme(theme: Theme, extracted: ThemePalette): Theme {
  return {
    ...theme,
    palette: mergeExtractedPalette(extracted, theme.paletteOverrides),
    paletteExtractedFromUrl: theme.backgroundUrl,
  };
}

export async function extractPaletteFromImageUrl(imageUrl: string): Promise<ThemePalette> {
  const colors = await extractColors(imageUrl, { crossOrigin: "anonymous" });
  return mapExtractedColorsToPalette(colors);
}
