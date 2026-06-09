import { getRenderPocket, getShellLayout } from "./layout";
import { drawShell, resizeShellCanvas } from "./renderer";
import { rgbaFromHex, shellFillAlphas } from "./shell-colors";
import { getShellState, patchAnimationState } from "./shell-state";
import type { ShellThemeColors } from "./renderer";
const SPEED_T = 0.16;
const SPEED_ANCHOR = 0.22;
const SPEED_SPAN = 0.17;
const SPEED_DEPTH = 0.17;

type FrameListener = (frame: {
  layout: ReturnType<typeof getShellLayout>;
  pocket: ReturnType<typeof getRenderPocket>;
}) => void;

let frameListener: FrameListener | null = null;
let rafId: number | null = null;

export function registerShellFrameListener(listener: FrameListener | null) {
  frameListener = listener;
}

export function startShellAnimation(
  canvas: HTMLCanvasElement,
  getTheme: () => ShellThemeColors,
) {
  stopShellAnimation();

  const tick = () => {
    resizeShellCanvas(canvas);
    const layout = getShellLayout();
    const state = getShellState();
    const targetT = state.closing ? 0 : state.activeZoneId ? 1 : 0;

    const nextT = state.t + (targetT - state.t) * SPEED_T;
    const nextAnchor = state.anchor + (state.targetAnchor - state.anchor) * SPEED_ANCHOR;
    const nextSpan = state.span + (state.targetSpan - state.span) * SPEED_SPAN;
    const nextDepth = state.depth + (state.targetDepth - state.depth) * SPEED_DEPTH;

    let closing = state.closing;
    let settledT = nextT;

    if (closing && nextT < 0.02) {
      closing = false;
      settledT = 0;
    }

    patchAnimationState({
      t: settledT,
      anchor: nextAnchor,
      span: nextSpan,
      depth: nextDepth,
      closing,
      ...(closing === false && state.closing ? { previousZoneId: null } : {}),
    });

    const pocket = getRenderPocket(layout, getShellState());
    drawShell(canvas, layout, pocket, getTheme());
    frameListener?.({ layout, pocket });
    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
}

export function stopShellAnimation() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

export function themeToShellColors(theme: {
  palette: { surface: string; text: string; accent: string; background: string };
  glassOpacity?: number;
}): ShellThemeColors {
  const { rim, notch } = shellFillAlphas(theme.glassOpacity ?? 0.72);
  const surface = theme.palette.surface;

  return {
    ambient: theme.palette.background,
    glassStops: [
      rgbaFromHex(surface, rim),
      rgbaFromHex(surface, rim * 0.94),
      rgbaFromHex(surface, rim * 0.88),
    ],
    notchFill: rgbaFromHex(surface, notch),
    strokeOuter: rgbaFromHex(surface, Math.min(rim + 0.08, 1)),
    strokeInner: "rgba(255, 255, 255, 0.45)",
    shadow: "rgba(0, 0, 0, 0.22)",
  };
}
