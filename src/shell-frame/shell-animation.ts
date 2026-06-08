import { getRenderPocket, getShellLayout } from "./layout";
import { drawShell, resizeShellCanvas } from "./renderer";
import { getShellState, patchShellState } from "./shell-state";
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
    const targetT = state.activeGroupId || state.closing ? 1 : 0;

    const nextT = state.t + (targetT - state.t) * SPEED_T;
    const nextAnchor = state.anchor + (state.targetAnchor - state.anchor) * SPEED_ANCHOR;
    const nextSpan = state.span + (state.targetSpan - state.span) * SPEED_SPAN;
    const nextDepth = state.depth + (state.targetDepth - state.depth) * SPEED_DEPTH;

    let closing = state.closing;
    let settledT = nextT;

    if (closing) {
      const settled =
        nextT > 0.995 &&
        Math.abs(nextAnchor - state.targetAnchor) < 0.4 &&
        Math.abs(nextSpan - state.targetSpan) < 0.4 &&
        Math.abs(nextDepth - state.targetDepth) < 0.4;

      if (settled) {
        closing = false;
        settledT = 0;
      } else {
        settledT = 1 - nextT;
      }
    }

    patchShellState({
      t: settledT,
      anchor: nextAnchor,
      span: nextSpan,
      depth: nextDepth,
      closing,
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
}): ShellThemeColors {
  return {
    ambient: theme.palette.background,
    glassStops: [
      "rgba(255, 255, 255, 0.12)",
      "rgba(255, 255, 255, 0.08)",
      "rgba(255, 255, 255, 0.05)",
    ],
    strokeOuter: "rgba(255, 255, 255, 0.14)",
    strokeInner: "rgba(255, 255, 255, 0.55)",
    shadow: "rgba(0, 0, 0, 0.28)",
  };
}
