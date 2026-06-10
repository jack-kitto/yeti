import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("canvas zone layout UI", () => {
  const css = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");
  const stackSource = readFileSync(
    resolve(__dirname, "../components/shell/canvas-widget-stack.tsx"),
    "utf8",
  );

  it("scopes editorial typography via appliedPresetId on the canvas stage", () => {
    expect(stackSource).toContain('data-applied-preset={workspace.theme.appliedPresetId ?? undefined}');
  });

  it("applies editorial preset font and widget polish via scoped CSS", () => {
    expect(stackSource).toContain("editorialFont");
    expect(css).toContain('[data-applied-preset="editorial"] .canvas-widget-quote');
    expect(css).toContain('[data-applied-preset="editorial"] .canvas-focus-tasks-header');
  });

  it("anchors editorial zones to corners with viewport insets", () => {
    expect(css).toMatch(
      /\.canvas-widget-stage\[data-applied-preset="editorial"\][\s\S]*padding:\s*10vh\s+10vw/,
    );
    expect(css).toContain(
      '[data-applied-preset="editorial"] .canvas-zone-upper-center',
    );
    expect(css).toContain(
      '[data-applied-preset="editorial"] .canvas-zone-lower-right',
    );
    expect(css).toContain(
      '[data-applied-preset="editorial"] .canvas-zone-lower-left',
    );
  });

  it("uses a five-zone grid driven by buildCanvasZoneLayout", () => {
    expect(stackSource).toContain("buildCanvasZoneLayout");
    expect(stackSource).toContain("canvas-zone-upper-center");
    expect(css).toMatch(/\.canvas-widget-stage[\s\S]*grid-template-areas/);
    expect(css).toContain(".canvas-zone-upper-center");
    expect(css).toContain(".canvas-zone-bottom-center");
  });
});
