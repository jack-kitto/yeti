import { describe, expect, it } from "vitest";
import { rgbaFromHex, shellFillAlphas } from "./shell-colors";

describe("shell-colors", () => {
  it("converts hex surface to rgba", () => {
    expect(rgbaFromHex("#fffdf9", 0.96)).toBe("rgba(255, 253, 249, 0.96)");
  });

  it("targets a nearly-solid notch and opaque rim", () => {
    const alphas = shellFillAlphas(0.72);
    expect(alphas.rim).toBeCloseTo(0.854, 2);
    expect(alphas.notch).toBeCloseTo(0.972, 2);
    expect(alphas.notch).toBeGreaterThan(alphas.rim);
  });
});
