export const EDITORIAL_CLOCK_TYPOGRAPHY_VARS = {
  "--canvas-widget-clock-time-size": "clamp(4rem, 12vw, 7rem)",
  "--canvas-widget-clock-time-weight": "700",
  "--canvas-widget-clock-time-tracking": "-0.04em",
} as const;

export function editorialTypographyCssVars(theme: {
  appliedLayoutPresetId?: string;
  appliedPresetId?: string;
}): Record<string, string> {
  const layoutPresetId = theme.appliedLayoutPresetId ?? theme.appliedPresetId;
  if (layoutPresetId !== "editorial") {
    return {};
  }

  return { ...EDITORIAL_CLOCK_TYPOGRAPHY_VARS };
}
