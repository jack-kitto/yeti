import { describe, expect, it } from "vitest";
import { getFlyoutRevealProgress, getRenderPocket, getShellLayout } from "./layout";
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
