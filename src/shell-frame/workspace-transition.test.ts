import { describe, expect, it } from "vitest";
import { createStarterLibrary } from "@/library/starter-template";
import {
  getWorkspaceCanvasOffset,
  getWorkspaceTransitionExpand,
  resolveWorkspaceTransitionDirection,
} from "./workspace-transition";

describe("resolveWorkspaceTransitionDirection", () => {
  it("picks the shorter path around the workspace ring", () => {
    const library = createStarterLibrary();
    const [work, personal] = library.workspaces;

    expect(
      resolveWorkspaceTransitionDirection({ ...library, activeWorkspaceId: work.id }, personal.id),
    ).toBe("next");
    expect(
      resolveWorkspaceTransitionDirection({ ...library, activeWorkspaceId: personal.id }, work.id),
    ).toBe("next");
  });
});

describe("getWorkspaceTransitionExpand", () => {
  it("ramps up to full expansion at the midpoint then contracts", () => {
    expect(getWorkspaceTransitionExpand(0)).toBe(0);
    expect(getWorkspaceTransitionExpand(0.5)).toBe(1);
    expect(getWorkspaceTransitionExpand(1)).toBe(0);
    expect(getWorkspaceTransitionExpand(0.25)).toBeGreaterThan(0);
    expect(getWorkspaceTransitionExpand(0.75)).toBeGreaterThan(0);
  });
});

describe("getWorkspaceCanvasOffset", () => {
  it("slides out during the first half and in during the second half", () => {
    const panelWidth = 1000;
    const exit = getWorkspaceCanvasOffset(0.25, "next", panelWidth);
    const enter = getWorkspaceCanvasOffset(0.75, "next", panelWidth);

    expect(exit).toBeLessThan(0);
    expect(enter).toBeGreaterThan(0);
    expect(getWorkspaceCanvasOffset(0, "next", panelWidth)).toBeCloseTo(0);
    expect(getWorkspaceCanvasOffset(1, "next", panelWidth)).toBeCloseTo(0);
  });
});
