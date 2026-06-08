import type { EdgePosition } from "@/library/types";
import type { RenderPocket, ShellLayout } from "./layout";

export type ShellThemeColors = {
  ambient: string;
  glassStops: [string, string, string];
  strokeOuter: string;
  strokeInner: string;
  shadow: string;
};

function addTopPocket(
  path: Path2D,
  x1: number,
  x2: number,
  y: number,
  depth: number,
  r: number,
) {
  path.lineTo(x1 - r, y);
  path.quadraticCurveTo(x1, y, x1, y + r);
  path.lineTo(x1, y + depth - r);
  path.quadraticCurveTo(x1, y + depth, x1 + r, y + depth);
  path.lineTo(x2 - r, y + depth);
  path.quadraticCurveTo(x2, y + depth, x2, y + depth - r);
  path.lineTo(x2, y + r);
  path.quadraticCurveTo(x2, y, x2 + r, y);
}

function addBottomPocket(
  path: Path2D,
  x2: number,
  x1: number,
  y: number,
  depth: number,
  r: number,
) {
  path.lineTo(x2 + r, y);
  path.quadraticCurveTo(x2, y, x2, y - r);
  path.lineTo(x2, y - depth + r);
  path.quadraticCurveTo(x2, y - depth, x2 - r, y - depth);
  path.lineTo(x1 + r, y - depth);
  path.quadraticCurveTo(x1, y - depth, x1, y - depth + r);
  path.lineTo(x1, y - r);
  path.quadraticCurveTo(x1, y, x1 - r, y);
}

function addLeftPocket(
  path: Path2D,
  x: number,
  y2: number,
  y1: number,
  depth: number,
  r: number,
) {
  path.lineTo(x, y2 + r);
  path.quadraticCurveTo(x, y2, x + r, y2);
  path.lineTo(x + depth - r, y2);
  path.quadraticCurveTo(x + depth, y2, x + depth, y2 - r);
  path.lineTo(x + depth, y1 + r);
  path.quadraticCurveTo(x + depth, y1, x + depth - r, y1);
  path.lineTo(x + r, y1);
  path.quadraticCurveTo(x, y1, x, y1 - r);
}

function generateShellPath(layout: ShellLayout, pocket: RenderPocket): Path2D {
  const { panelX: x, panelY: y, panelRight: right, panelBottom: bottom, shellRadius: rr } =
    layout;
  const path = new Path2D();
  path.moveTo(x + rr, y);

  if (pocket.active && pocket.edge === "top") {
    const x1 = pocket.anchor - pocket.span;
    const x2 = pocket.anchor + pocket.span;
    path.lineTo(x1 - pocket.radius, y);
    addTopPocket(path, x1, x2, y, pocket.depth, pocket.radius);
    path.lineTo(right - rr, y);
  } else {
    path.lineTo(right - rr, y);
  }

  path.quadraticCurveTo(right, y, right, y + rr);
  path.lineTo(right, bottom - rr);
  path.quadraticCurveTo(right, bottom, right - rr, bottom);

  if (pocket.active && pocket.edge === "bottom") {
    const x1 = pocket.anchor - pocket.span;
    const x2 = pocket.anchor + pocket.span;
    path.lineTo(x2 + pocket.radius, bottom);
    addBottomPocket(path, x2, x1, bottom, pocket.depth, pocket.radius);
    path.lineTo(x + rr, bottom);
  } else {
    path.lineTo(x + rr, bottom);
  }

  path.quadraticCurveTo(x, bottom, x, bottom - rr);

  if (pocket.active && pocket.edge === "left") {
    const y1 = pocket.anchor - pocket.span;
    const y2 = pocket.anchor + pocket.span;
    path.lineTo(x, y2 + pocket.radius);
    addLeftPocket(path, x, y2, y1, pocket.depth, pocket.radius);
    path.lineTo(x, y + rr);
  } else {
    path.lineTo(x, y + rr);
  }

  path.quadraticCurveTo(x, y, x + rr, y);
  path.closePath();
  return path;
}

export function resizeShellCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  const ctx = canvas.getContext("2d");
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
}

export function drawShell(
  canvas: HTMLCanvasElement,
  layout: ShellLayout,
  pocket: RenderPocket,
  theme: ShellThemeColors,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  ctx.clearRect(0, 0, layout.w, layout.h);

  const ambient = ctx.createRadialGradient(
    layout.w * 0.5,
    layout.h * 0.45,
    40,
    layout.w * 0.5,
    layout.h * 0.45,
    layout.w * 0.55,
  );
  ambient.addColorStop(0, "rgba(255, 255, 255, 0.08)");
  ambient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = ambient;
  ctx.fillRect(0, 0, layout.w, layout.h);

  const path = generateShellPath(layout, pocket);

  ctx.save();
  ctx.shadowColor = theme.shadow;
  ctx.shadowBlur = 42;
  ctx.shadowOffsetY = 18;
  ctx.fillStyle = "rgba(8, 11, 20, 0.12)";
  ctx.fill(path);
  ctx.restore();

  const fill = ctx.createLinearGradient(
    layout.panelX,
    layout.panelY,
    layout.panelRight,
    layout.panelBottom,
  );
  fill.addColorStop(0, theme.glassStops[0]);
  fill.addColorStop(0.45, theme.glassStops[1]);
  fill.addColorStop(1, theme.glassStops[2]);
  ctx.fillStyle = fill;
  ctx.fill(path);

  ctx.save();
  ctx.clip(path);
  const gloss = ctx.createLinearGradient(
    layout.panelX,
    layout.panelY,
    layout.panelX,
    layout.panelBottom,
  );
  gloss.addColorStop(0, "rgba(255, 255, 255, 0.1)");
  gloss.addColorStop(0.2, "rgba(255, 255, 255, 0.04)");
  gloss.addColorStop(1, "rgba(255, 255, 255, 0.015)");
  ctx.fillStyle = gloss;
  ctx.fillRect(layout.panelX, layout.panelY, layout.panelW, layout.panelH);
  ctx.restore();

  ctx.strokeStyle = theme.strokeOuter;
  ctx.lineWidth = 3.5;
  ctx.stroke(path);
  ctx.strokeStyle = theme.strokeInner;
  ctx.lineWidth = 1.25;
  ctx.stroke(path);
}
