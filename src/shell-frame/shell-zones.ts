import {
  getShellLayout,
  getTargetPocketForZone,
  type ShellZoneLayout,
} from "./layout";
import { getLatestShellZones, getShellState, patchShellState } from "./shell-state";

const CLOSE_DELAY_MS = 110;

function cancelScheduledClose() {
  const state = getShellState();
  if (state.closeTimer) {
    clearTimeout(state.closeTimer);
    patchShellState({ closeTimer: null });
  }
}

function scheduleClose() {
  cancelScheduledClose();
  const timer = setTimeout(() => {
    const state = getShellState();
    if (!state.pinned && !state.overIcon && !state.overMenu) {
      clearActiveZone();
    }
  }, CLOSE_DELAY_MS);
  patchShellState({ closeTimer: timer });
}

export function activateZone(
  groupId: string,
  zones: ShellZoneLayout[],
): void {
  const zone = zones.find((entry) => entry.id === groupId);
  if (!zone) {
    return;
  }

  const state = getShellState();
  if (state.activeGroupId === groupId && !state.closing) {
    return;
  }

  const layout = getShellLayout();
  const menuSize = state.menuSizes.get(groupId) ?? { width: 170, height: 130 };
  const target = getTargetPocketForZone(zone, menuSize, layout);

  patchShellState({
    previousGroupId: state.activeGroupId,
    activeGroupId: groupId,
    closing: false,
    renderEdge: zone.edge,
    lastEdge: zone.edge,
    targetAnchor: target.anchor,
    targetSpan: target.span,
    targetDepth: target.depth,
  });
}

export function clearActiveZone(): void {
  const state = getShellState();
  if (!state.activeGroupId) {
    return;
  }

  const zones = getLatestShellZones();
  const zone = zones.find((entry) => entry.id === state.activeGroupId);
  if (!zone) {
    patchShellState({
      previousGroupId: state.activeGroupId,
      activeGroupId: null,
      closing: true,
      pinned: false,
    });
    return;
  }

  const layout = getShellLayout();
  const menuSize = state.menuSizes.get(zone.id) ?? { width: 170, height: 130 };
  const target = getTargetPocketForZone(zone, menuSize, layout);

  patchShellState({
    previousGroupId: state.activeGroupId,
    activeGroupId: null,
    closing: true,
    pinned: false,
    renderEdge: zone.edge,
    lastEdge: zone.edge,
    targetAnchor: target.anchor,
    targetSpan: target.span,
    targetDepth: target.depth,
  });
}

export function setZoneHover(kind: "icon" | "menu", active: boolean) {
  if (kind === "icon") {
    patchShellState({ overIcon: active });
    if (active) {
      cancelScheduledClose();
    } else {
      scheduleClose();
    }
    return;
  }

  patchShellState({ overMenu: active });
  if (active) {
    cancelScheduledClose();
  } else {
    scheduleClose();
  }
}

export function toggleZonePin(groupId: string, zones: ShellZoneLayout[]) {
  const state = getShellState();
  if (state.pinned && state.activeGroupId === groupId) {
    patchShellState({ pinned: false });
    scheduleClose();
    return;
  }

  activateZone(groupId, zones);
  patchShellState({ pinned: true });
  cancelScheduledClose();
}

export function dismissPinnedZone() {
  patchShellState({ pinned: false });
  clearActiveZone();
}
