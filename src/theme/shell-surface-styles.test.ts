import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("shell surface DOM styles", () => {
  const css = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");
  const themeSource = readFileSync(resolve(__dirname, "./theme.ts"), "utf8");

  it("styles flyouts and settings from shell surface CSS variables", () => {
    expect(css).toMatch(/\[data-qs-shell-surface="solid"\][\s\S]*\.shell-config-dialog/);
    expect(css).toMatch(/\.shell-config-dialog[\s\S]*var\(--qs-shell-backdrop-blur/);
    expect(css).toMatch(/\.shell-config-dialog[\s\S]*var\(--qs-shell-fill-strength/);
  });

  it("sets data-qs-shell-surface when applying a theme", () => {
    expect(themeSource).toContain("qsShellSurface");
  });
});
