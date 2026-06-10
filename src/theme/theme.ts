import type { Theme, ThemePalette } from "@/library/types";

function parseHexChannel(hex: string, offset: number): number {
  return Number.parseInt(hex.trim().replace("#", "").slice(offset, offset + 2), 16);
}

function lerpHexChannel(from: number, to: number, t: number): number {
  return Math.round(from + (to - from) * t);
}

function lerpHexColor(from: string, to: string, t: number): string {
  const clamped = Math.min(1, Math.max(0, t));
  const channels = [0, 2, 4].map((offset) =>
    lerpHexChannel(parseHexChannel(from, offset), parseHexChannel(to, offset), clamped),
  );
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

export function lerpPalette(from: ThemePalette, to: ThemePalette, t: number): ThemePalette {
  return {
    background: lerpHexColor(from.background, to.background, t),
    surface: lerpHexColor(from.surface, to.surface, t),
    text: lerpHexColor(from.text, to.text, t),
    accent: lerpHexColor(from.accent, to.accent, t),
  };
}

export function themeToCssVars(theme: Theme): Record<string, string> {
  return {
    "--qs-color-background": theme.palette.background,
    "--qs-color-surface": theme.palette.surface,
    "--qs-color-text": theme.palette.text,
    "--qs-color-accent": theme.palette.accent,
    "--qs-background-image": theme.backgroundUrl ? `url(${theme.backgroundUrl})` : "none",
    "--qs-glass-opacity": String(theme.glassOpacity),
    "--qs-border-radius": `${theme.borderRadius}px`,
  };
}

export function applyTheme(element: HTMLElement, theme: Theme): void {
  const vars = themeToCssVars(theme);
  for (const [key, value] of Object.entries(vars)) {
    element.style.setProperty(key, value);
  }
}
