import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("drawShell", () => {
  const source = readFileSync(resolve(__dirname, "./renderer.ts"), "utf8");

  it("uses a flat fill path for solid shell surfaces", () => {
    expect(source).toContain("function drawFlatSolidShell");
    expect(source).toContain("function drawGlassShell");
    expect(source).toContain('theme.shellSurface === "solid"');
    expect(source).toContain("drawFlatSolidShell(ctx, layout, pocket, theme)");
  });
});
