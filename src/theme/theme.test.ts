import { describe, expect, it } from "vitest";
import { themeToCssVars } from "./theme";
import type { Theme } from "@/library/types";

describe("themeToCssVars", () => {
  it("maps palette and background URL to CSS custom properties", () => {
    const theme: Theme = {
      palette: {
        background: "#f5f0e8",
        surface: "#fffdf9",
        text: "#2c2419",
        accent: "#c17f59",
      },
      backgroundUrl: "https://example.com/bg.jpg",
      glassOpacity: 0.72,
      borderRadius: 20,
    };

    expect(themeToCssVars(theme)).toEqual({
      "--qs-color-background": "#f5f0e8",
      "--qs-color-surface": "#fffdf9",
      "--qs-color-text": "#2c2419",
      "--qs-color-accent": "#c17f59",
      "--qs-background-image": "url(https://example.com/bg.jpg)",
      "--qs-glass-opacity": "0.72",
      "--qs-border-radius": "20px",
    });
  });
});
