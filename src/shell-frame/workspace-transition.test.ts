import { describe, expect, it } from "vitest";
import {
  getWorkspaceRippleClipPath,
  getWorkspaceTransitionReveal,
} from "./workspace-transition";

describe("getWorkspaceTransitionReveal", () => {
  it("eases from zero to one across the transition", () => {
    expect(getWorkspaceTransitionReveal(0)).toBe(0);
    expect(getWorkspaceTransitionReveal(1)).toBe(1);
    expect(getWorkspaceTransitionReveal(0.5)).toBeGreaterThan(0);
    expect(getWorkspaceTransitionReveal(0.5)).toBeLessThan(1);
  });
});

describe("getWorkspaceRippleClipPath", () => {
  it("expands a circular reveal from the switch origin", () => {
    expect(getWorkspaceRippleClipPath(0, 120, 80, 1440, 900)).toBe(
      "circle(0px at 120px 80px)",
    );
    expect(getWorkspaceRippleClipPath(1, 120, 80, 1440, 900)).toMatch(
      /^circle\(\d+(\.\d+)?px at 120px 80px\)$/,
    );
  });
});
