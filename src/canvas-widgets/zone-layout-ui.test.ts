import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("canvas zone layout UI", () => {
  const css = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");
  const stackSource = readFileSync(
    resolve(__dirname, "../components/shell/canvas-widget-stack.tsx"),
    "utf8",
  );
  const editorialStackSource = readFileSync(
    resolve(__dirname, "../components/shell/editorial-canvas-stack.tsx"),
    "utf8",
  );

  it("scopes editorial typography via appliedPresetId on the canvas stage", () => {
    expect(stackSource).toContain('data-applied-preset={workspace.theme.appliedPresetId ?? undefined}');
  });

  it("renders editorial timer corners when pomodoro replaces the clock", () => {
    expect(editorialStackSource).toContain("CanvasEditorialTimerTimeWidget");
    expect(editorialStackSource).toContain("CanvasEditorialTimerPhaseWidget");
    expect(editorialStackSource).toContain('isWidgetInLayout(layout, "pomodoro")');
  });

  it("uses a dedicated four-corner editorial canvas layout", () => {
    expect(stackSource).toContain("EditorialCanvasStack");
    expect(stackSource).toContain('appliedPresetId === "editorial"');
    expect(editorialStackSource).toContain("editorialFont");
    expect(css).toContain(".canvas-widget-stage--editorial");
    expect(css).toContain(".canvas-editorial-tl");
    expect(css).toContain(".canvas-editorial-tr");
    expect(css).toContain(".canvas-editorial-bl");
    expect(css).toContain(".canvas-editorial-br");
  });

  it("applies editorial preset font and widget polish via scoped CSS", () => {
    expect(css).toContain(".canvas-widget-stage--editorial .canvas-widget-quote");
    expect(css).toContain(".canvas-widget-stage--editorial .canvas-focus-tasks-header");
    expect(css).toMatch(
      /\.canvas-widget-stage--editorial \.canvas-now-playing-visualizer[\s\S]*height:\s*36px/,
    );
    expect(css).toMatch(
      /\.canvas-widget-stage--editorial[\s\S]*padding:\s*10vh\s+10vw/,
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
