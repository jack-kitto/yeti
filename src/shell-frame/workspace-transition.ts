import type { Library } from "@/library/types";
import { easeOutCubic } from "./utils";

export type WorkspaceTransitionDirection = "next" | "previous";

export type WorkspaceTransitionSnapshot = {
  running: boolean;
  expand: number;
  canvasOffsetX: number;
};

const TRANSITION_DURATION_MS = 520;

const listeners = new Set<() => void>();
let snapshot: WorkspaceTransitionSnapshot = {
  running: false,
  expand: 0,
  canvasOffsetX: 0,
};

let rafId: number | null = null;

export function getWorkspaceTransitionSnapshot(): WorkspaceTransitionSnapshot {
  return snapshot;
}

export function subscribeWorkspaceTransition(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitWorkspaceTransition() {
  for (const listener of listeners) {
    listener();
  }
}

function patchWorkspaceTransition(patch: Partial<WorkspaceTransitionSnapshot>) {
  snapshot = { ...snapshot, ...patch };
  emitWorkspaceTransition();
}

export function isWorkspaceTransitionRunning(): boolean {
  return snapshot.running;
}

export function resolveWorkspaceTransitionDirection(
  library: Library,
  targetWorkspaceId: string,
): WorkspaceTransitionDirection {
  const currentIndex = library.workspaces.findIndex(
    (workspace) => workspace.id === library.activeWorkspaceId,
  );
  const targetIndex = library.workspaces.findIndex(
    (workspace) => workspace.id === targetWorkspaceId,
  );

  if (currentIndex === -1 || targetIndex === -1 || currentIndex === targetIndex) {
    return "next";
  }

  const forward =
    (targetIndex - currentIndex + library.workspaces.length) % library.workspaces.length;
  const backward =
    (currentIndex - targetIndex + library.workspaces.length) % library.workspaces.length;

  return forward <= backward ? "next" : "previous";
}

export function getWorkspaceTransitionExpand(progress: number): number {
  const clamped = Math.max(0, Math.min(1, progress));

  if (clamped <= 0.5) {
    return easeOutCubic(clamped / 0.5);
  }

  return easeOutCubic((1 - clamped) / 0.5);
}

export function getWorkspaceCanvasOffset(
  progress: number,
  direction: WorkspaceTransitionDirection,
  panelWidth: number,
): number {
  const clamped = Math.max(0, Math.min(1, progress));
  const sign = direction === "next" ? -1 : 1;
  const travel = panelWidth * 0.22;

  if (clamped <= 0.5) {
    return sign * travel * easeOutCubic(clamped / 0.5);
  }

  const enterT = (clamped - 0.5) / 0.5;
  return -sign * travel * (1 - easeOutCubic(enterT));
}

export function startWorkspaceTransition(args: {
  direction: WorkspaceTransitionDirection;
  panelWidth: number;
  onSwap: () => void;
}): void {
  if (snapshot.running) {
    return;
  }

  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }

  let swapped = false;
  const start = performance.now();
  patchWorkspaceTransition({ running: true, expand: 0, canvasOffsetX: 0 });

  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / TRANSITION_DURATION_MS);
    const expand = getWorkspaceTransitionExpand(progress);

    if (progress >= 0.5 && !swapped) {
      swapped = true;
      args.onSwap();
    }

    patchWorkspaceTransition({
      running: progress < 1,
      expand,
      canvasOffsetX: getWorkspaceCanvasOffset(progress, args.direction, args.panelWidth),
    });

    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
      return;
    }

    rafId = null;
    patchWorkspaceTransition({ running: false, expand: 0, canvasOffsetX: 0 });
  };

  rafId = requestAnimationFrame(tick);
}
