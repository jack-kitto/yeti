import type { EdgePosition } from "@/library/types";
import type { MenuSize, ShellZoneLayout } from "./layout";

export type ShellAnimationSnapshot = {
  activeGroupId: string | null;
  previousGroupId: string | null;
  closing: boolean;
  pinned: boolean;
  t: number;
  anchor: number;
  targetAnchor: number;
  span: number;
  targetSpan: number;
  depth: number;
  targetDepth: number;
  renderEdge: EdgePosition;
  lastEdge: EdgePosition;
  overIcon: boolean;
  overMenu: boolean;
};

export type ShellState = ShellAnimationSnapshot & {
  menuSizes: Map<string, MenuSize>;
  closeTimer: ReturnType<typeof setTimeout> | null;
};

export function createInitialShellState(): ShellState {
  return {
    activeGroupId: null,
    previousGroupId: null,
    closing: false,
    pinned: false,
    t: 0,
    anchor: 0,
    targetAnchor: 0,
    span: 100,
    targetSpan: 100,
    depth: 140,
    targetDepth: 140,
    renderEdge: "left",
    lastEdge: "left",
    menuSizes: new Map(),
    overIcon: false,
    overMenu: false,
    closeTimer: null,
  };
}

let shellState: ShellState = createInitialShellState();
let latestZones: ShellZoneLayout[] = [];
const listeners = new Set<() => void>();

export function setLatestShellZones(zones: ShellZoneLayout[]) {
  latestZones = zones;
}

export function getLatestShellZones(): ShellZoneLayout[] {
  return latestZones;
}

export function getShellState(): ShellState {
  return shellState;
}

export function subscribeShellState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitShellState() {
  for (const listener of listeners) {
    listener();
  }
}

export function patchShellState(patch: Partial<ShellState>) {
  shellState = { ...shellState, ...patch };
  emitShellState();
}

export function setMenuSize(groupId: string, size: MenuSize) {
  const next = new Map(shellState.menuSizes);
  next.set(groupId, size);
  patchShellState({ menuSizes: next });
}

export function resetShellState() {
  if (shellState.closeTimer) {
    clearTimeout(shellState.closeTimer);
  }
  shellState = createInitialShellState();
  emitShellState();
}
