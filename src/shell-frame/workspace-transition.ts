import type { Workspace } from "@/library/types";
import { easeOutCubic } from "./utils";

export type WorkspaceTransitionSnapshot = {
  running: boolean;
  /** 0 = ripple origin only, 1 = full viewport revealed. */
  reveal: number;
  originX: number;
  originY: number;
  outgoingWorkspace: Workspace | null;
};

const TRANSITION_DURATION_MS = 520;

const listeners = new Set<() => void>();
let snapshot: WorkspaceTransitionSnapshot = {
  running: false,
  reveal: 0,
  originX: 0,
  originY: 0,
  outgoingWorkspace: null,
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

export function getWorkspaceTransitionReveal(progress: number): number {
  return easeOutCubic(Math.max(0, Math.min(1, progress)));
}

export function getWorkspaceRippleClipPath(
  reveal: number,
  originX: number,
  originY: number,
  width: number,
  height: number,
): string {
  const maxRadius = Math.hypot(width, height);
  const radius = getWorkspaceTransitionReveal(reveal) * maxRadius;
  return `circle(${radius}px at ${originX}px ${originY}px)`;
}

export function getViewportCenterOrigin(): { x: number; y: number } {
  if (typeof window === "undefined") {
    return { x: 0, y: 0 };
  }

  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
}

export function startWorkspaceTransition(args: {
  outgoingWorkspace: Workspace;
  originX: number;
  originY: number;
  onSwap: () => void;
}): void {
  if (snapshot.running) {
    return;
  }

  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }

  args.onSwap();

  const start = performance.now();
  patchWorkspaceTransition({
    running: true,
    reveal: 0,
    originX: args.originX,
    originY: args.originY,
    outgoingWorkspace: args.outgoingWorkspace,
  });

  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / TRANSITION_DURATION_MS);
    const reveal = getWorkspaceTransitionReveal(progress);

    patchWorkspaceTransition({
      running: progress < 1,
      reveal,
      ...(progress >= 1 ? { outgoingWorkspace: null } : {}),
    });

    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
      return;
    }

    rafId = null;
    patchWorkspaceTransition({
      running: false,
      reveal: 0,
      outgoingWorkspace: null,
    });
  };

  rafId = requestAnimationFrame(tick);
}
