import { clamp, easeOutCubic, lerp } from "./utils";
import type { ShellAnimationSnapshot } from "./shell-state";
import { isBuiltinSurface, type ShellRim, type ShellZoneKind } from "./rim";

export type ShellLayout = {
  w: number;
  h: number;
  frameLeft: number;
  frameTop: number;
  frameBottom: number;
  frameRight: number;
  panelX: number;
  panelY: number;
  panelW: number;
  panelH: number;
  panelRight: number;
  panelBottom: number;
  shellRadius: number;
  pocketCorner: number;
  pocketInset: number;
  edgePadding: number;
  sidePadding: number;
};

export type ShellZoneLayout = {
  id: string;
  rim: ShellRim;
  kind: ShellZoneKind;
  x: number;
  y: number;
};

export type RenderPocket = {
  rim: ShellRim;
  anchor: number;
  span: number;
  depth: number;
  radius: number;
  active: boolean;
};

export type MenuSize = { width: number; height: number };

const FRAME_TOP = 14;
const FRAME_BOTTOM = 14;
const FRAME_RIGHT = 14;

export function getShellLayout(): ShellLayout {
  const w = typeof window === "undefined" ? 1280 : window.innerWidth;
  const h = typeof window === "undefined" ? 800 : window.innerHeight;
  const frameLeft = Math.max(56, w * 0.055);
  const frameTop = FRAME_TOP;
  const frameBottom = FRAME_BOTTOM;
  const frameRight = FRAME_RIGHT;

  const panelX = frameLeft;
  const panelY = frameTop;
  const panelW = w - frameLeft - frameRight;
  const panelH = h - frameTop - frameBottom;

  return {
    w,
    h,
    frameLeft,
    frameTop,
    frameBottom,
    frameRight,
    panelX,
    panelY,
    panelW,
    panelH,
    panelRight: panelX + panelW,
    panelBottom: panelY + panelH,
    shellRadius: 28,
    pocketCorner: 18,
    pocketInset: 18,
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
  const leftGroups = zones.filter((zone) => zone.kind === "edge-group");
  const centerX = layout.panelX + layout.panelW * 0.5;
  const centerY = layout.panelY + layout.panelH * 0.5;

  return zones.map((zone) => {
    if (zone.kind === "edge-group") {
      const index = leftGroups.findIndex((entry) => entry.id === zone.id);
      return {
        ...zone,
        x: layout.frameLeft * 0.5,
        y: distribute(
          layout.panelY + layout.sidePadding,
          layout.panelBottom - layout.sidePadding,
          leftGroups.length,
          index,
        ),
      };
    }

    if (zone.kind === "dashboard") {
      return { ...zone, x: centerX, y: layout.frameTop * 0.5 };
    }

    if (zone.kind === "search") {
      return { ...zone, x: centerX, y: layout.h - layout.frameBottom * 0.5 };
    }

    return { ...zone, x: layout.w - layout.frameRight * 0.5, y: centerY };
  });
}

export function getTargetPocketForZone(
  zone: ShellZoneLayout,
  menuSize: MenuSize,
  layout: ShellLayout,
): Pick<RenderPocket, "rim" | "anchor" | "span" | "depth"> {
  if (zone.kind === "dashboard") {
    const span = Math.min(layout.panelW * 0.42, 480);
    const depth = Math.max(menuSize.height + layout.pocketInset * 2 + 8, 220);
    return {
      rim: "top",
      anchor: layout.panelX + layout.panelW * 0.5,
      span,
      depth,
    };
  }

  if (zone.kind === "search") {
    const span = Math.max(Math.ceil(menuSize.width * 0.5) + 18, 72);
    const depth = Math.min(
      menuSize.height + layout.pocketInset * 2 + 4,
      layout.panelH * 0.5,
    );
    return {
      rim: "bottom",
      anchor: layout.panelX + layout.panelW * 0.5,
      span,
      depth,
    };
  }

  if (zone.kind === "config") {
    const span = Math.max(menuSize.height * 0.5 + 28, 120);
    const depth = Math.max(menuSize.width + layout.pocketInset * 2 + 8, 280);
    return {
      rim: "right",
      anchor: layout.panelY + layout.panelH * 0.5,
      span,
      depth,
    };
  }

  const span = Math.max(Math.ceil(menuSize.height * 0.5) + 22, 82);
  const depth = Math.max(menuSize.width + layout.pocketInset * 2 + 6, 110);
  const cornerGuard = layout.shellRadius + layout.pocketCorner + span + 12;
  const anchor = clamp(
    zone.y,
    layout.panelY + cornerGuard,
    layout.panelBottom - cornerGuard,
  );

  return { rim: "left", anchor, span, depth };
}

export function getRenderPocket(
  layout: ShellLayout,
  animation: ShellAnimationSnapshot,
): RenderPocket {
  const depth = animation.depth * easeOutCubic(clamp(animation.t, 0, 1));
  const span = animation.span;
  const radius = Math.min(layout.pocketCorner, depth * 0.28, span * 0.34);
  const rim = animation.renderRim;
  const isHorizontal = rim === "top" || rim === "bottom";
  const cornerGuard = layout.shellRadius + radius + span + 12;
  const anchor = clamp(
    animation.anchor,
    isHorizontal ? layout.panelX + cornerGuard : layout.panelY + cornerGuard,
    isHorizontal
      ? layout.panelRight - cornerGuard
      : layout.panelBottom - cornerGuard,
  );

  return { rim, anchor, span, depth, radius, active: depth > 0.4 };
}

export function getSurfacePosition(
  layout: ShellLayout,
  pocket: RenderPocket,
  zone: ShellZoneLayout,
  menuSize: MenuSize,
): { x: number; y: number } {
  switch (zone.rim) {
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
    case "right":
      return {
        x: layout.panelRight - layout.pocketInset - menuSize.width * 0.5,
        y: pocket.anchor,
      };
  }
}

/** @deprecated Use getSurfacePosition */
export const getFlyoutPosition = getSurfacePosition;

export function getFlyoutRevealProgress(
  animation: ShellAnimationSnapshot,
): number {
  if (animation.closing) {
    return easeOutCubic(clamp(1 - animation.t, 0, 1));
  }
  if (!animation.activeZoneId) {
    return 0;
  }
  return easeOutCubic(clamp(animation.t, 0, 1));
}

export function isSurfacePointerActive(
  activeZoneId: string | null,
  zoneId: string,
  revealProgress: number,
  closing: boolean,
  previousZoneId: string | null,
): boolean {
  if (revealProgress < 0.12) {
    return false;
  }
  if (!closing && activeZoneId === zoneId) {
    return true;
  }
  return closing && previousZoneId === zoneId;
}

export function isSurfaceInteractive(
  layout: ShellLayout,
  pocket: RenderPocket,
  zone: ShellZoneLayout,
  menuSize: MenuSize,
  activeZoneId: string | null,
  revealProgress: number,
): boolean {
  if (
    revealProgress < 0.55 ||
    !activeZoneId ||
    zone.id !== activeZoneId ||
    zone.rim !== pocket.rim
  ) {
    return false;
  }

  if (isBuiltinSurface(zone.id)) {
    if (zone.rim === "top" || zone.rim === "bottom") {
      return pocket.depth >= menuSize.height * 0.55 + layout.pocketInset;
    }
    return pocket.depth >= menuSize.width * 0.55 + layout.pocketInset;
  }

  return (
    pocket.depth >= menuSize.width * 0.55 + layout.pocketInset &&
    Math.abs(pocket.anchor - zone.y) < 48
  );
}

/** @deprecated Use isSurfaceInteractive */
export const isFlyoutInteractive = isSurfaceInteractive;
