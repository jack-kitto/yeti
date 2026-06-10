import { describe, expect, it } from "vitest";
import {
  getWorkspacePaletteMorph,
  getWorkspaceTransitionSeal,
} from "./workspace-transition";

describe("getWorkspaceTransitionSeal", () => {
  it("closes during the first half and opens during the second", () => {
    expect(getWorkspaceTransitionSeal(0)).toBe(0);
    expect(getWorkspaceTransitionSeal(0.5)).toBe(1);
    expect(getWorkspaceTransitionSeal(1)).toBe(0);
    expect(getWorkspaceTransitionSeal(0.25)).toBeGreaterThan(0);
    expect(getWorkspaceTransitionSeal(0.75)).toBeGreaterThan(0);
  });
});

describe("getWorkspacePaletteMorph", () => {
  it("stays at zero until the swap point then eases to one", () => {
    expect(getWorkspacePaletteMorph(0)).toBe(0);
    expect(getWorkspacePaletteMorph(0.49)).toBe(0);
    expect(getWorkspacePaletteMorph(0.5)).toBe(0);
    expect(getWorkspacePaletteMorph(0.62)).toBe(1);
    expect(getWorkspacePaletteMorph(0.56)).toBeGreaterThan(0);
    expect(getWorkspacePaletteMorph(0.56)).toBeLessThan(1);
  });
});
