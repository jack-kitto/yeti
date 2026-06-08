import type { Library } from "@/library/types";
import { resolveEdgeGroups } from "@/placement/placement";
import { getShellLayout, updateZonePositions, type ShellZoneLayout } from "./layout";
import { BUILTIN_SURFACE } from "./rim";

export function buildShellZones(library: Library): ShellZoneLayout[] {
  const zones: ShellZoneLayout[] = [];

  for (const group of resolveEdgeGroups(library, "left")) {
    zones.push({
      id: group.id,
      rim: "left",
      kind: "edge-group",
      x: 0,
      y: 0,
    });
  }

  zones.push(
    {
      id: BUILTIN_SURFACE.TOP_DASHBOARD,
      rim: "top",
      kind: "dashboard",
      x: 0,
      y: 0,
    },
    {
      id: BUILTIN_SURFACE.BOTTOM_SEARCH,
      rim: "bottom",
      kind: "search",
      x: 0,
      y: 0,
    },
    {
      id: BUILTIN_SURFACE.RIGHT_CONFIG,
      rim: "right",
      kind: "config",
      x: 0,
      y: 0,
    },
  );

  return updateZonePositions(zones, getShellLayout());
}
