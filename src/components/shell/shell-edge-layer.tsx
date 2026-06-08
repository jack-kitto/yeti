"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { resolveEdgeHandleDisplay } from "@/edge-handle/edge-handle";
import { nearestSlotIndex, computeEdgeSlotCenters } from "@/edge-slots/edge-slots";
import type { EdgePosition, Library } from "@/library/types";
import { resolveEdgeGroupFlyout, resolveEdgeGroups } from "@/placement/placement";
import { buildShellZones } from "@/shell-frame/build-zones";
import {
  getFlyoutPosition,
  getShellLayout,
  isFlyoutVisible,
  updateZonePositions,
} from "@/shell-frame/layout";
import { registerShellFrameListener } from "@/shell-frame/shell-animation";
import {
  getShellState,
  setLatestShellZones,
  setMenuSize,
  subscribeShellState,
} from "@/shell-frame/shell-state";
import {
  activateZone,
  dismissPinnedZone,
  setZoneHover,
  toggleZonePin,
} from "@/shell-frame/shell-zones";
import { useLauncherStore } from "@/store/launcher-store";
import { LinkItem } from "./link-item";

const DRAG_THRESHOLD_PX = 6;

type ShellEdgeLayerProps = {
  library: Library;
  onReorderGroup: (edge: EdgePosition, groupId: string, targetSlotIndex: number) => void;
};

function groupById(library: Library, edge: EdgePosition, groupId: string) {
  return resolveEdgeGroups(library, edge).find((group) => group.id === groupId);
}

export function ShellEdgeLayer({ library, onReorderGroup }: ShellEdgeLayerProps) {
  const zones = useMemo(() => buildShellZones(library), [library]);
  const zonesRef = useRef(zones);
  zonesRef.current = zones;

  useEffect(() => {
    setLatestShellZones(zones);
    zonesRef.current = updateZonePositions(zones, getShellLayout());
  }, [zones]);

  const iconRefs = useRef(new Map<string, HTMLButtonElement>());
  const flyoutRefs = useRef(new Map<string, HTMLDivElement>());
  const dragRef = useRef<{
    groupId: string;
    edge: EdgePosition;
    startAxis: number;
    dragged: boolean;
  } | null>(null);
  const openFromEdgeGroup = useLauncherStore((state) => state.openFromEdgeGroup);
  const shellState = useSyncExternalStore(subscribeShellState, getShellState, getShellState);

  useEffect(() => {
    for (const zone of zones) {
      const element = flyoutRefs.current.get(zone.id);
      if (!element) {
        continue;
      }
      element.classList.add("measuring");
      const { width, height } = element.getBoundingClientRect();
      setMenuSize(zone.id, {
        width: Math.ceil(width),
        height: Math.ceil(height),
      });
      element.classList.remove("measuring");
    }
  }, [zones, library]);

  useEffect(() => {
    registerShellFrameListener(({ layout, pocket }) => {
      const positioned = updateZonePositions(zonesRef.current, layout);
      const state = getShellState();

      for (const zone of positioned) {
        const icon = iconRefs.current.get(zone.id);
        if (icon) {
          icon.style.left = `${zone.x}px`;
          icon.style.top = `${zone.y}px`;
          icon.classList.toggle("active", zone.id === state.activeGroupId);
        }

        const flyout = flyoutRefs.current.get(zone.id);
        const menuSize = state.menuSizes.get(zone.id) ?? { width: 170, height: 130 };
        if (!flyout) {
          continue;
        }

        const { x, y } = getFlyoutPosition(layout, pocket, zone, menuSize);
        flyout.style.left = `${x}px`;
        flyout.style.top = `${y}px`;
        const visible = isFlyoutVisible(
          layout,
          pocket,
          zone,
          menuSize,
          state.activeGroupId,
        );
        flyout.classList.toggle("visible", visible);
        flyout.classList.toggle(
          "exiting",
          !visible && zone.id === state.previousGroupId,
        );
      }
    });

    return () => registerShellFrameListener(null);
  }, []);

  useEffect(() => {
    function handleResize() {
      zonesRef.current = updateZonePositions(zonesRef.current, getShellLayout());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function axisPosition(
    edge: EdgePosition,
    clientX: number,
    clientY: number,
    container: DOMRect,
  ) {
    if (edge === "left") {
      return clientY - container.top;
    }
    return clientX - container.left;
  }

  function finishDrag(edge: EdgePosition, groupId: string, axisPx: number) {
    const groups = resolveEdgeGroups(library, edge);
    const rimLength =
      edge === "left" ? window.innerHeight : window.innerWidth;
    const slotCenters = computeEdgeSlotCenters(groups.length, rimLength);
    onReorderGroup(edge, groupId, nearestSlotIndex(axisPx, slotCenters));
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {zones.map((zone) => {
        const group = groupById(library, zone.edge, zone.id);
        if (!group) {
          return null;
        }

        const display = resolveEdgeHandleDisplay(group);
        const { links, hasMore } = resolveEdgeGroupFlyout(library, zone.edge, zone.id);

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
                activateZone(zone.id, zonesRef.current);
              }}
              onMouseLeave={() => setZoneHover("icon", false)}
              onFocus={() => {
                setZoneHover("icon", true);
                activateZone(zone.id, zonesRef.current);
              }}
              onBlur={() => setZoneHover("icon", false)}
              onClick={() => toggleZonePin(zone.id, zonesRef.current)}
              onPointerDown={(event) => {
                const layout = getShellLayout();
                const container =
                  zone.edge === "left"
                    ? new DOMRect(0, 0, layout.w, layout.h)
                    : new DOMRect(0, 0, layout.w, layout.h);
                dragRef.current = {
                  groupId: zone.id,
                  edge: zone.edge,
                  startAxis: axisPosition(
                    zone.edge,
                    event.clientX,
                    event.clientY,
                    container,
                  ),
                  dragged: false,
                };
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                const drag = dragRef.current;
                if (!drag || drag.groupId !== zone.id) {
                  return;
                }
                const layout = getShellLayout();
                const container = new DOMRect(0, 0, layout.w, layout.h);
                const axis = axisPosition(
                  zone.edge,
                  event.clientX,
                  event.clientY,
                  container,
                );
                if (Math.abs(axis - drag.startAxis) > DRAG_THRESHOLD_PX) {
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
                  const layout = getShellLayout();
                  finishDrag(
                    zone.edge,
                    zone.id,
                    axisPosition(
                      zone.edge,
                      event.clientX,
                      event.clientY,
                      new DOMRect(0, 0, layout.w, layout.h),
                    ),
                  );
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
                  flyoutRefs.current.set(zone.id, node);
                } else {
                  flyoutRefs.current.delete(zone.id);
                }
              }}
              className="shell-flyout"
              onMouseEnter={() => setZoneHover("menu", true)}
              onMouseLeave={() => setZoneHover("menu", false)}
            >
              <p className="shell-flyout-title">{group.name}</p>
              {links.map((link) => (
                <LinkItem key={link.id} link={link} />
              ))}
              {hasMore ? (
                <button
                  type="button"
                  className="shell-flyout-more"
                  onClick={() => openFromEdgeGroup(zone.edge, zone.id)}
                >
                  See more…
                </button>
              ) : null}
              {shellState.pinned && shellState.activeGroupId === zone.id ? (
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
