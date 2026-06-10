import { describe, expect, it } from "vitest";
import { rgbaFromHex, shellFillAlphas } from "./shell-colors";
import { themeToShellColors } from "./shell-animation";

const palette = {
  background: "#f5f0e8",
  surface: "#fffdf9",
  text: "#2c2419",
  accent: "#c17f59",
};

describe("shell-colors", () => {
  it("converts hex surface to rgba", () => {
    expect(rgbaFromHex("#fffdf9", 0.96)).toBe("rgba(255, 253, 249, 0.96)");
  });

  it("targets a nearly-solid notch and opaque rim for glass", () => {
    const alphas = shellFillAlphas("glass", 0.72);
    expect(alphas.rim).toBeCloseTo(0.854, 2);
    expect(alphas.notch).toBeCloseTo(0.972, 2);
    expect(alphas.notch).toBeGreaterThan(alphas.rim);
  });

  it("renders solid shell fills opaque without blur", () => {
    const colors = themeToShellColors({
      palette,
      shellSurface: "solid",
      glassOpacity: 0.72,
    });

    expect(colors.glassStops[0]).toBe("rgba(255, 253, 249, 1)");
    expect(colors.notchFill).toBe("rgba(255, 253, 249, 1)");
    expect(colors.backdropBlur).toBe(0);
  });

  it("renders glass shell with frosted backdrop blur", () => {
    const colors = themeToShellColors({
      palette,
      shellSurface: "glass",
      glassOpacity: 0.72,
    });

    expect(colors.backdropBlur).toBeGreaterThan(0);
    expect(colors.glassStops[0]).toMatch(/rgba\(255, 253, 249, 0\./);
  });

  it("renders transparent shell lighter than glass at the same glassOpacity", () => {
    const glass = themeToShellColors({
      palette,
      shellSurface: "glass",
      glassOpacity: 0.72,
    });
    const transparent = themeToShellColors({
      palette,
      shellSurface: "transparent",
      glassOpacity: 0.72,
    });

    const glassAlpha = Number.parseFloat(glass.glassStops[0].split(", ")[3]!.replace(")", ""));
    const transparentAlpha = Number.parseFloat(
      transparent.glassStops[0].split(", ")[3]!.replace(")", ""),
    );

    expect(transparentAlpha).toBeLessThan(glassAlpha);
    expect(transparent.backdropBlur).toBeGreaterThan(0);
  });
});
