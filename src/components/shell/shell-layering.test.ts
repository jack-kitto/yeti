import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("shell layering", () => {
  const css = readFileSync(resolve(__dirname, "../../app/globals.css"), "utf8");
  const surfaceSource = readFileSync(
    resolve(__dirname, "./shell-workspace-surface.tsx"),
    "utf8",
  );

  it("paints the rim canvas beneath the canvas widget layer", () => {
    expect(css).toMatch(/\.shell-rim-canvas[\s\S]*z-index:\s*5/);
    expect(css).toMatch(/\.shell-canvas-layer[\s\S]*z-index:\s*11/);
    expect(surfaceSource.indexOf("ShellCanvas")).toBeLessThan(
      surfaceSource.indexOf("shell-canvas-layer"),
    );
  });
});
