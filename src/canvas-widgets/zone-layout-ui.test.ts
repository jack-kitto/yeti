import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("canvas zone layout UI", () => {
  const css = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");
  const stackSource = readFileSync(
    resolve(__dirname, "../components/shell/canvas-widget-stack.tsx"),
    "utf8",
  );

  it("uses a five-zone grid driven by buildCanvasZoneLayout", () => {
    expect(stackSource).toContain("buildCanvasZoneLayout");
    expect(stackSource).toContain("canvas-zone-upper-center");
    expect(css).toMatch(/\.canvas-widget-stage[\s\S]*grid-template-areas/);
    expect(css).toContain(".canvas-zone-upper-center");
    expect(css).toContain(".canvas-zone-bottom-center");
  });
});
