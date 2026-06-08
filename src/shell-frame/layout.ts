import type { EdgePosition } from "@/library/types";
import { clamp, easeOutCubic, lerp } from "./utils";
import type { ShellAnimationSnapshot } from "./shell-state";

export type ShellLayout = {
  w: number;
  h: number;
  panelX: number;
  panelY: number;
  panelW: number;
  panelH: number;
  panelRight: number;
  panelBottom: number;
  shellRadius: number;
  pocketCorner: number;
  pocketInset: number;
  iconOffset: number;
  edgePadding: number;
  sidePadding: number;
};

export type ShellZoneLayout = {
  id: string;
  edge: EdgePosition;
  x: number;
  y: number;
};

export type RenderPocket = {
  edge: EdgePosition;
  anchor: number;
  span: number;
  depth: number;
  radius: number;
  active: boolean;
};

export type MenuSize = { width: number; height: number };

export function getShellLayout(): ShellLayout {
  const w = typeof window === "undefined" ? 1280 : window.innerWidth;
  const h = typeof window === "undefined" ? 800 : window.innerHeight;
  const marginX = Math.max(64, w * 0.07);
  const marginY = Math.max(56, h * 0.08);

  const panelX = marginX;
  const panelY = marginY;
  const panelW = w - marginX * 2;
  const panelH = h - marginY * 2;

  return {
    w,
    h,
    panelX,
    panelY,
    panelW,
    panelH,
    panelRight: panelX + panelW,
    panelBottom: panelY + panelH,
    shellRadius: 28,
    pocketCorner: 18,
    pocketInset: 18,
    iconOffset: 42,
    edgePadding: 150,
    sidePadding: 130,
  };
}

export function distribute(
  start: number,
  end: number,
  count: number,
  index: number,
): number {
  if (count <= 1) {
    return (start + end) * 0.5;
  }
  return lerp(start, end, index / (count - 1));
}

export function updateZonePositions(
  zones: ShellZoneLayout[],
  layout: ShellLayout,
): ShellZoneLayout[] {
  const byEdge = {
    top: zones.filter((zone) => zone.edge === "top"),
    bottom: zones.filter((zone) => zone.edge === "bottom"),
    left: zones.filter((zone) => zone.edge === "left"),
  };

  return zones.map((zone) => {
    if (zone.edge === "top") {
      const index = byEdge.top.findIndex((entry) => entry.id === zone.id);
      return {
        ...zone,
        x: distribute(
          layout.panelX + layout.edgePadding,
          layout.panelRight - layout.edgePadding,
          byEdge.top.length,
          index,
        ),
        y: layout.panelY - layout.iconOffset,
      };
    }

    if (zone.edge === "bottom") {
      const index = byEdge.bottom.findIndex((entry) => entry.id === zone.id);
      return {
        ...zone,
        x: distribute(
          layout.panelX + layout.edgePadding,
          layout.panelRight - layout.edgePadding,
          byEdge.bottom.length,
          index,
        ),
        y: layout.panelBottom + layout.iconOffset,
      };
    }

    const index = byEdge.left.findIndex((entry) => entry.id === zone.id);
    return {
      ...zone,
      x: layout.panelX - layout.iconOffset,
      y: distribute(
        layout.panelY + layout.sidePadding,
        layout.panelBottom - layout.sidePadding,
        byEdge.left.length,
        index,
      ),
    };
  });
}

export function getTargetPocketForZone(
  zone: ShellZoneLayout,
  menuSize: MenuSize,
  layout: ShellLayout,
): Pick<RenderPocket, "edge" | "anchor" | "span" | "depth"> {
  const isHorizontal = zone.edge === "top" || zone.edge === "bottom";
  const span = Math.max(
    isHorizontal
      ? Math.ceil(menuSize.width * 0.5) + 22
      : Math.ceil(menuSize.height * 0.5) + 22,
    82,
  );
  const depth = Math.max(
    isHorizontal
      ? menuSize.height + layout.pocketInset * 2 + 6
      : menuSize.width + layout.pocketInset * 2 + 6,
    110,
  );
  const cornerGuard = layout.shellRadius + layout.pocketCorner + span + 12;
  const anchor = isHorizontal
    ? clamp(zone.x, layout.panelX + cornerGuard, layout.panelRight - cornerGuard)
    : clamp(zone.y, layout.panelY + cornerGuard, layout.panelBottom - cornerGuard);

  return { edge: zone.edge, anchor, span, depth };
}

export function getRenderPocket(
  layout: ShellLayout,
  animation: ShellAnimationSnapshot,
): RenderPocket {
  const depth = animation.depth * easeOutCubic(clamp(animation.t, 0, 1));
  const span = animation.span;
  const radius = Math.min(layout.pocketCorner, depth * 0.28, span * 0.34);
  const edge = animation.renderEdge;
  const isHorizontal = edge === "top" || edge === "bottom";
  const cornerGuard = layout.shellRadius + radius + span + 12;
  const anchor = clamp(
    animation.anchor,
    isHorizontal ? layout.panelX + cornerGuard : layout.panelY + cornerGuard,
    isHorizontal
      ? layout.panelRight - cornerGuard
      : layout.panelBottom - cornerGuard,
  );

  return { edge, anchor, span, depth, radius, active: depth > 0.4 };
}

export function getFlyoutPosition(
  layout: ShellLayout,
  pocket: RenderPocket,
  zone: ShellZoneLayout,
  menuSize: MenuSize,
): { x: number; y: number } {
  switch (zone.edge) {
    case "top":
      return {
        x: pocket.anchor,
        y: layout.panelY + layout.pocketInset + menuSize.height * 0.5,
      };
    case "bottom":
      return {
        x: pocket.anchor,
        y: layout.panelBottom - layout.pocketInset - menuSize.height * 0.5,
      };
    case "left":
      return {
        x: layout.panelX + layout.pocketInset + menuSize.width * 0.5,
        y: pocket.anchor,
      };
  }
}

export function isFlyoutVisible(
  layout: ShellLayout,
  pocket: RenderPocket,
  zone: ShellZoneLayout,
  menuSize: MenuSize,
  activeGroupId: string | null,
): boolean {
  if (!activeGroupId || zone.id !== activeGroupId || zone.edge !== pocket.edge) {
    return false;
  }

  if (zone.edge === "top" || zone.edge === "bottom") {
    return (
      pocket.depth >= menuSize.height + layout.pocketInset * 1.2 &&
      Math.abs(pocket.anchor - zone.x) < 34
    );
  }

  return (
    pocket.depth >= menuSize.width + layout.pocketInset * 1.2 &&
    Math.abs(pocket.anchor - zone.y) < 34
  );
}
