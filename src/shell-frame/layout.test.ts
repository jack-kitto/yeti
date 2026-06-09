import { describe, expect, it } from "vitest";
import {
  getFlyoutRevealProgress,
  getRenderPocket,
  getShellLayout,
  getSurfacePocketFit,
  getSurfaceRevealStyle,
} from "./layout";
import type { ShellZoneLayout } from "./layout";
import type { ShellAnimationSnapshot } from "./shell-state";

function baseAnimation(
  patch: Partial<ShellAnimationSnapshot> = {},
): ShellAnimationSnapshot {
  return {
    activeZoneId: "group-a",
    previousZoneId: null,
    closing: false,
    pinned: false,
    t: 0,
    anchor: 400,
    targetAnchor: 400,
    span: 120,
    targetSpan: 120,
    depth: 160,
    targetDepth: 160,
    renderRim: "left",
    lastRim: "left",
    overIcon: false,
    overMenu: false,
    ...patch,
  };
}

describe("getRenderPocket", () => {
  it("expands span and depth from a point as t increases", () => {
    const layout = getShellLayout();
    const closed = getRenderPocket(layout, baseAnimation({ t: 0 }));
    const open = getRenderPocket(layout, baseAnimation({ t: 1 }));

    expect(closed.span).toBe(0);
    expect(closed.depth).toBe(0);
    expect(closed.active).toBe(false);
    expect(open.span).toBeCloseTo(120, 0);
    expect(open.depth).toBeCloseTo(160, 0);
    expect(open.active).toBe(true);
  });
});

describe("getSurfaceRevealStyle", () => {
  const topZone: ShellZoneLayout = {
    id: "dashboard",
    rim: "top",
    kind: "dashboard",
    x: 400,
    y: 7,
  };

  it("fades and scales down when the pocket is smaller than the menu", () => {
    const layout = getShellLayout();
    const pocket = getRenderPocket(
      layout,
      baseAnimation({ t: 0.35, depth: 260, span: 480 }),
    );
    const pocketFit = getSurfacePocketFit(pocket, topZone, { width: 480, height: 260 });
    const style = getSurfaceRevealStyle(1, pocketFit);

    expect(pocketFit).toBeLessThan(1);
    expect(style.opacity).toBeLessThan(pocketFit);
    expect(style.scale).toBeLessThan(1);
  });
});

describe("getFlyoutRevealProgress", () => {
  it("tracks t while closing instead of snapping shut", () => {
    expect(
      getFlyoutRevealProgress(baseAnimation({ closing: true, activeZoneId: null, t: 1 })),
    ).toBeCloseTo(1, 2);
    expect(
      getFlyoutRevealProgress(baseAnimation({ closing: true, activeZoneId: null, t: 0.5 })),
    ).toBeGreaterThan(0);
    expect(
      getFlyoutRevealProgress(baseAnimation({ closing: true, activeZoneId: null, t: 0 })),
    ).toBe(0);
  });
});
