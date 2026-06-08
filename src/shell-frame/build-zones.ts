import type { Library } from "@/library/types";
import { resolveEdgeGroups } from "@/placement/placement";
import { getShellLayout, updateZonePositions, type ShellZoneLayout } from "./layout";

export function buildShellZones(library: Library): ShellZoneLayout[] {
  const zones: ShellZoneLayout[] = [];

  for (const edge of ["left", "top", "bottom"] as const) {
    for (const group of resolveEdgeGroups(library, edge)) {
      zones.push({
        id: group.id,
        edge,
        x: 0,
        y: 0,
      });
    }
  }

  return updateZonePositions(zones, getShellLayout());
}
