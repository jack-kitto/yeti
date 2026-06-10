import type { ThemePalette } from "@/library/types";
import { easeOutCubic } from "./utils";

export type WorkspaceTransitionSnapshot = {
  running: boolean;
  /** 0 = open canvas, 1 = shell sealed over the viewport. */
  seal: number;
  /** 0 = outgoing palette, 1 = incoming workspace palette. */
  paletteMorph: number;
  fromPalette: ThemePalette | null;
  fromBackgroundUrl?: string;
};

const TRANSITION_DURATION_MS = 520;
const SWAP_AT = 0.5;
const MORPH_END = 0.62;

const listeners = new Set<() => void>();
let snapshot: WorkspaceTransitionSnapshot = {
  running: false,
  seal: 0,
  paletteMorph: 0,
  fromPalette: null,
  fromBackgroundUrl: undefined,
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

/** Close during the first half, open during the second — peaks at progress 0.5. */
export function getWorkspaceTransitionSeal(progress: number): number {
  const clamped = Math.max(0, Math.min(1, progress));

  if (clamped <= 0.5) {
    return easeOutCubic(clamped / 0.5);
  }

  return easeOutCubic((1 - clamped) / 0.5);
}

/** Palette cross-fade runs in the sealed phase right after the workspace swap. */
export function getWorkspacePaletteMorph(progress: number): number {
  if (progress < SWAP_AT) {
    return 0;
  }

  const morphT = (progress - SWAP_AT) / (MORPH_END - SWAP_AT);
  return easeOutCubic(Math.min(1, Math.max(0, morphT)));
}

export function startWorkspaceTransition(args: {
  fromPalette: ThemePalette;
  fromBackgroundUrl?: string;
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
  patchWorkspaceTransition({
    running: true,
    seal: 0,
    paletteMorph: 0,
    fromPalette: args.fromPalette,
    fromBackgroundUrl: args.fromBackgroundUrl,
  });

  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / TRANSITION_DURATION_MS);
    const seal = getWorkspaceTransitionSeal(progress);
    const paletteMorph = getWorkspacePaletteMorph(progress);

    if (progress >= SWAP_AT && !swapped) {
      swapped = true;
      args.onSwap();
    }

    patchWorkspaceTransition({
      running: progress < 1,
      seal,
      paletteMorph,
    });

    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
      return;
    }

    rafId = null;
    patchWorkspaceTransition({
      running: false,
      seal: 0,
      paletteMorph: 0,
      fromPalette: null,
      fromBackgroundUrl: undefined,
    });
  };

  rafId = requestAnimationFrame(tick);
}
