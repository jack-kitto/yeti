import { extractColors } from "extract-colors";
import type { Theme, ThemePalette } from "@/library/types";

export type ExtractedColor = {
  hex: string;
  lightness: number;
  saturation: number;
  area: number;
};

/** WCAG AA normal text — canvas widgets use smaller copy on image backdrops. */
export const MIN_CANVAS_TEXT_CONTRAST_RATIO = 4.5;

function normalizeHex(hex: string): string {
  const trimmed = hex.trim().toLowerCase();
  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
}

type Rgb = { r: number; g: number; b: number };

function parseHexRgb(hex: string): Rgb | null {
  const normalized = normalizeHex(hex).slice(1);
  if (normalized.length !== 6) {
    return null;
  }

  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value)) {
    return null;
  }

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const toChannel = (channel: number) =>
    Math.round(Math.min(255, Math.max(0, channel)))
      .toString(16)
      .padStart(2, "0");

  return `#${toChannel(r)}${toChannel(g)}${toChannel(b)}`;
}

function srgbToLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.040_45 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const rgb = parseHexRgb(hex);
  if (!rgb) {
    return 0;
  }

  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function lerpHexColor(from: string, to: string, t: number): string {
  const clamped = Math.min(1, Math.max(0, t));
  const fromRgb = parseHexRgb(from);
  const toRgb = parseHexRgb(to);
  if (!fromRgb || !toRgb) {
    return normalizeHex(to);
  }

  const mix = (left: number, right: number) => left + (right - left) * clamped;
  return rgbToHex({
    r: mix(fromRgb.r, toRgb.r),
    g: mix(fromRgb.g, toRgb.g),
    b: mix(fromRgb.b, toRgb.b),
  });
}

export function ensureCanvasTextContrast(
  text: string,
  background: string,
  minRatio = MIN_CANVAS_TEXT_CONTRAST_RATIO,
): string {
  const normalizedText = normalizeHex(text);
  const normalizedBackground = normalizeHex(background);

  if (contrastRatio(normalizedText, normalizedBackground) >= minRatio) {
    return normalizedText;
  }

  const extremes = ["#111111", "#f5f5f5"] as const;
  let bestCandidate: string | null = null;
  let bestContrast = 0;

  for (const extreme of extremes) {
    for (let step = 1; step <= 20; step += 1) {
      const candidate = lerpHexColor(normalizedText, extreme, step / 20);
      const candidateContrast = contrastRatio(candidate, normalizedBackground);
      if (candidateContrast >= minRatio) {
        return candidate;
      }
      if (candidateContrast > bestContrast) {
        bestContrast = candidateContrast;
        bestCandidate = candidate;
      }
    }
  }

  if (bestCandidate && bestContrast >= minRatio) {
    return bestCandidate;
  }

  const darkContrast = contrastRatio(extremes[0], normalizedBackground);
  const lightContrast = contrastRatio(extremes[1], normalizedBackground);
  return darkContrast >= lightContrast ? extremes[0] : extremes[1];
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

  const backgroundHex = normalizeHex(background.hex);
  const textHex = ensureCanvasTextContrast(text.hex, backgroundHex);

  return {
    background: backgroundHex,
    surface: normalizeHex(surface.hex),
    text: textHex,
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
