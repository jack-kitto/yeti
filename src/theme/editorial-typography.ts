export const EDITORIAL_CLOCK_TYPOGRAPHY_VARS = {
  "--canvas-widget-clock-time-size": "clamp(4rem, 12vw, 7rem)",
  "--canvas-widget-clock-time-weight": "700",
  "--canvas-widget-clock-time-tracking": "-0.04em",
} as const;

export function editorialTypographyCssVars(
  appliedPresetId?: string,
): Record<string, string> {
  if (appliedPresetId !== "editorial") {
    return {};
  }

  return { ...EDITORIAL_CLOCK_TYPOGRAPHY_VARS };
}
