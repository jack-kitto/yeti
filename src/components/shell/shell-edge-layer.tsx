"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { resolveEdgeHandleDisplay } from "@/edge-handle/edge-handle";
import {
  computeEdgeSlotCenters,
  computeMaxEdgeSlotCount,
  nearestSlotIndex,
  slotIndexToInsertIndex,
} from "@/edge-slots/edge-slots";
import type { Library } from "@/library/types";
import { resolveEdgeGroupFlyout, resolveEdgeGroups } from "@/placement/placement";
import { buildShellZones } from "@/shell-frame/build-zones";
import {
  getFlyoutRevealProgress,
  getShellLayout,
  getSurfacePosition,
  isSurfacePointerActive,
  updateZonePositions,
} from "@/shell-frame/layout";
import { BUILTIN_SURFACE } from "@/shell-frame/rim";
import { registerShellFrameListener } from "@/shell-frame/shell-animation";
import {
  getShellState,
  setLatestShellZones,
  setMenuSize,
  subscribeShellState,
} from "@/shell-frame/shell-state";
import {
  dismissPinnedZone,
  leaveZoneHover,
  requestActivateZone,
  setZoneHover,
  syncActiveZonePocket,
  toggleZonePin,
} from "@/shell-frame/shell-zones";
import { useLauncherStore } from "@/store/launcher-store";
import { CommandBar } from "./command-bar";
import { LinkItem } from "./link-item";
import { ShellDashboard } from "./shell-dashboard";
import { ShellSettingsButton } from "./shell-settings-button";

const DRAG_THRESHOLD_PX = 6;

type ShellEdgeLayerProps = {
  library: Library;
  onReorderGroup: (groupId: string, targetSlotIndex: number) => void;
  onSwitchWorkspace: (workspaceId: string) => void;
};

function groupById(library: Library, groupId: string) {
  return resolveEdgeGroups(library, "left").find((group) => group.id === groupId);
}

function defaultMenuSize(zoneId: string) {
  if (zoneId === BUILTIN_SURFACE.TOP_DASHBOARD) {
    return { width: 480, height: 260 };
  }
  if (zoneId === BUILTIN_SURFACE.BOTTOM_SEARCH) {
    return { width: 340, height: 48 };
  }
  return { width: 170, height: 130 };
}

export function ShellEdgeLayer({
  library,
  onReorderGroup,
  onSwitchWorkspace,
}: ShellEdgeLayerProps) {
  const zones = useMemo(() => buildShellZones(library), [library]);
  const zonesRef = useRef(zones);
  zonesRef.current = zones;

  const [rimLayout, setRimLayout] = useState(getShellLayout);

  useEffect(() => {
    setLatestShellZones(zones);
    zonesRef.current = updateZonePositions(zones, getShellLayout());
  }, [zones]);

  const iconRefs = useRef(new Map<string, HTMLButtonElement>());
  const surfaceRefs = useRef(new Map<string, HTMLDivElement>());
  const measureSurfaceRef = useRef(new Map<string, () => void>());
  const bridgeRefs = useRef(new Map<string, HTMLDivElement>());
  const dragRef = useRef<{
    groupId: string;
    startAxis: number;
    dragged: boolean;
  } | null>(null);
  const openFromEdgeGroup = useLauncherStore((state) => state.openFromEdgeGroup);
  const shellState = useSyncExternalStore(subscribeShellState, getShellState, getShellState);

  const activeWorkspace = library.workspaces.find(
    (workspace) => workspace.id === library.activeWorkspaceId,
  );

  useEffect(() => {
    const observers: ResizeObserver[] = [];

    for (const zone of zones) {
      const element = surfaceRefs.current.get(zone.id);
      if (!element) {
        continue;
      }

      const measure = (forInitialLayout: boolean) => {
        if (forInitialLayout) {
          element.classList.add("measuring");
        }
        // offset* ignores CSS transforms; getBoundingClientRect includes the
        // per-frame scale on .shell-surface and can retrigger ResizeObserver forever.
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const changed = setMenuSize(zone.id, {
          width: Math.ceil(width),
          height: Math.ceil(height),
        });
        if (changed) {
          syncActiveZonePocket(zone.id);
        }
        if (forInitialLayout) {
          element.classList.remove("measuring");
        }
      };

      measure(true);
      measureSurfaceRef.current.set(zone.id, () => measure(false));
      const observer = new ResizeObserver(() => measure(false));
      observer.observe(element);
      observers.push(observer);
    }

    return () => {
      measureSurfaceRef.current.clear();
      for (const observer of observers) {
        observer.disconnect();
      }
    };
  }, [zones, library]);

  useEffect(() => {
    registerShellFrameListener(({ layout: frameLayout, pocket }) => {
      const positioned = updateZonePositions(zonesRef.current, frameLayout);
      const state = getShellState();
      const reveal = getFlyoutRevealProgress(state);

      function zoneReveal(zoneId: string) {
        if (state.closing && zoneId === state.previousZoneId) {
          return reveal;
        }
        if (!state.closing && zoneId === state.activeZoneId) {
          return reveal;
        }
        return 0;
      }

      for (const zone of positioned) {
        const icon = iconRefs.current.get(zone.id);
        if (icon) {
          icon.style.left = `${zone.x}px`;
          icon.style.top = `${zone.y}px`;
          icon.classList.toggle("active", zone.id === state.activeZoneId);
        }

        const surface = surfaceRefs.current.get(zone.id);
        const menuSize = state.menuSizes.get(zone.id) ?? defaultMenuSize(zone.id);
        if (!surface) {
          continue;
        }

        const { x, y } = getSurfacePosition(frameLayout, pocket, zone, menuSize);
        surface.style.left = `${x}px`;
        surface.style.top = `${y}px`;

        const progress = zoneReveal(zone.id);
        const scale = 0.9 + progress * 0.1;
        surface.style.opacity = `${progress}`;
        surface.style.transform = `translate(-50%, -50%) scale(${scale})`;

        const pointerActive = isSurfacePointerActive(
          state.activeZoneId,
          zone.id,
          progress,
          state.closing,
          state.previousZoneId,
        );
        surface.style.pointerEvents = pointerActive ? "auto" : "none";
        surface.classList.toggle("visible", progress > 0.04);

        if (zone.kind === "edge-group") {
          const bridge = bridgeRefs.current.get(zone.id);
          if (bridge) {
            const flyoutLeft = x - menuSize.width * 0.5;
            const flyoutTop = y - menuSize.height * 0.5;
            const iconRight = zone.x + 18;
            const bridgeLeft = iconRight;
            const bridgeWidth = Math.max(12, flyoutLeft - iconRight);
            const bridgeTop = Math.min(zone.y - 24, flyoutTop);
            const bridgeHeight = Math.max(menuSize.height, 48, zone.y + 24 - bridgeTop);

            bridge.style.left = `${bridgeLeft}px`;
            bridge.style.top = `${bridgeTop}px`;
            bridge.style.width = `${bridgeWidth}px`;
            bridge.style.height = `${bridgeHeight}px`;
            bridge.style.pointerEvents =
              pointerActive && state.activeZoneId === zone.id ? "auto" : "none";
            bridge.style.opacity = pointerActive ? "1" : "0";
          }
        }
      }
    });

    return () => registerShellFrameListener(null);
  }, []);

  useEffect(() => {
    function handleResize() {
      setRimLayout(getShellLayout());
      zonesRef.current = updateZonePositions(zonesRef.current, getShellLayout());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function finishDrag(groupId: string, axisPx: number) {
    const groups = resolveEdgeGroups(library, "left");
    const maxSlots = computeMaxEdgeSlotCount(window.innerHeight);
    const slotCenters = computeEdgeSlotCenters(maxSlots, window.innerHeight);
    const targetSlot = nearestSlotIndex(axisPx, slotCenters);
    const insertIndex = slotIndexToInsertIndex(targetSlot, groups.length, maxSlots);
    onReorderGroup(groupId, insertIndex);
  }

  function renderRimHit(zoneId: string, className: string, style: CSSProperties) {
    return (
      <div
        className={`shell-rim-hit ${className}`}
        style={style}
        onMouseEnter={() => {
          setZoneHover("rim", true);
          requestActivateZone(zoneId, zonesRef.current);
        }}
        onMouseLeave={() => leaveZoneHover("rim")}
      />
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {renderRimHit(BUILTIN_SURFACE.TOP_DASHBOARD, "shell-rim-hit-top", {
        top: 0,
        left: 0,
        right: 0,
        height: rimLayout.frameTop,
      })}
      {renderRimHit(BUILTIN_SURFACE.BOTTOM_SEARCH, "shell-rim-hit-bottom", {
        bottom: 0,
        left: 0,
        right: 0,
        height: rimLayout.frameBottom,
      })}

      <ShellSettingsButton />

      {zones.map((zone) => {
        if (zone.kind === "dashboard") {
          return (
            <div
              key={zone.id}
              ref={(node) => {
                if (node) {
                  surfaceRefs.current.set(zone.id, node);
                } else {
                  surfaceRefs.current.delete(zone.id);
                }
              }}
              className="shell-surface shell-surface-dashboard"
              onMouseEnter={() => setZoneHover("menu", true)}
              onMouseLeave={() => leaveZoneHover("menu")}
            >
              <ShellDashboard />
            </div>
          );
        }

        if (zone.kind === "search") {
          return (
            <div
              key={zone.id}
              ref={(node) => {
                if (node) {
                  surfaceRefs.current.set(zone.id, node);
                } else {
                  surfaceRefs.current.delete(zone.id);
                }
              }}
              className="shell-surface shell-surface-search"
              onMouseEnter={() => setZoneHover("menu", true)}
              onMouseLeave={() => leaveZoneHover("menu")}
            >
              <CommandBar
                library={library}
                variant="pocket"
                onSwitchWorkspace={onSwitchWorkspace}
                onFocusChange={(focused) => setZoneHover("menu", focused)}
                onContentChange={() =>
                  measureSurfaceRef.current.get(BUILTIN_SURFACE.BOTTOM_SEARCH)?.()
                }
              />
            </div>
          );
        }

        const group = groupById(library, zone.id);
        if (!group) {
          return null;
        }

        const display = resolveEdgeHandleDisplay(group);
        const { links, hasMore } = resolveEdgeGroupFlyout(library, "left", zone.id);

        return (
          <div key={zone.id}>
            <button
              ref={(node) => {
                if (node) {
                  iconRefs.current.set(zone.id, node);
                } else {
                  iconRefs.current.delete(zone.id);
                }
              }}
              type="button"
              className="shell-icon-btn"
              style={{ left: zone.x, top: zone.y }}
              aria-label={group.name}
              onMouseEnter={() => {
                setZoneHover("icon", true);
                requestActivateZone(zone.id, zonesRef.current);
              }}
              onMouseLeave={() => leaveZoneHover("icon")}
              onFocus={() => {
                setZoneHover("icon", true);
                requestActivateZone(zone.id, zonesRef.current);
              }}
              onBlur={() => leaveZoneHover("icon")}
              onClick={() => toggleZonePin(zone.id, zonesRef.current)}
              onPointerDown={(event) => {
                const frameLayout = getShellLayout();
                dragRef.current = {
                  groupId: zone.id,
                  startAxis: event.clientY,
                  dragged: false,
                };
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                const drag = dragRef.current;
                if (!drag || drag.groupId !== zone.id) {
                  return;
                }
                if (Math.abs(event.clientY - drag.startAxis) > DRAG_THRESHOLD_PX) {
                  drag.dragged = true;
                }
              }}
              onPointerUp={(event) => {
                const drag = dragRef.current;
                if (!drag || drag.groupId !== zone.id) {
                  return;
                }
                event.currentTarget.releasePointerCapture(event.pointerId);
                if (drag.dragged) {
                  finishDrag(zone.id, event.clientY);
                }
                dragRef.current = null;
              }}
            >
              {display.kind === "image" ? (
                <img src={display.url} alt="" className="shell-icon-image" />
              ) : (
                <span className="shell-icon-glyph">{display.text}</span>
              )}
            </button>

            <div
              ref={(node) => {
                if (node) {
                  bridgeRefs.current.set(zone.id, node);
                } else {
                  bridgeRefs.current.delete(zone.id);
                }
              }}
              className="shell-hover-bridge"
              aria-hidden
              onMouseEnter={() => setZoneHover("bridge", true)}
              onMouseLeave={() => leaveZoneHover("bridge")}
            />

            <div
              ref={(node) => {
                if (node) {
                  surfaceRefs.current.set(zone.id, node);
                } else {
                  surfaceRefs.current.delete(zone.id);
                }
              }}
              className="shell-surface shell-flyout"
              onMouseEnter={() => setZoneHover("menu", true)}
              onMouseLeave={() => leaveZoneHover("menu")}
            >
              <p className="shell-flyout-title">{group.name}</p>
              {links.map((link) => (
                <LinkItem key={link.id} link={link} />
              ))}
              {hasMore ? (
                <button
                  type="button"
                  className="shell-flyout-more"
                  onClick={() => openFromEdgeGroup("left", zone.id)}
                >
                  See more…
                </button>
              ) : null}
              {shellState.pinned && shellState.activeZoneId === zone.id ? (
                <button
                  type="button"
                  className="shell-flyout-dismiss"
                  onClick={() => dismissPinnedZone()}
                >
                  Dismiss
                </button>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
