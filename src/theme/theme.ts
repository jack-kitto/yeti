import type { Theme } from "@/library/types";

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
