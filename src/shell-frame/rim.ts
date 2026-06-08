export type ShellRim = "left" | "top" | "bottom" | "right";

export type ShellZoneKind = "edge-group" | "dashboard" | "search" | "config";

export const BUILTIN_SURFACE = {
  TOP_DASHBOARD: "__rim_top__",
  BOTTOM_SEARCH: "__rim_bottom__",
  RIGHT_CONFIG: "__rim_right__",
} as const;

export function isBuiltinSurface(zoneId: string): boolean {
  return (
    zoneId === BUILTIN_SURFACE.TOP_DASHBOARD ||
    zoneId === BUILTIN_SURFACE.BOTTOM_SEARCH ||
    zoneId === BUILTIN_SURFACE.RIGHT_CONFIG
  );
}
