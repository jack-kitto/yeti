"use client";

import { useRef, useState, type CSSProperties, type RefObject } from "react";
import { resolveEdgeHandleDisplay } from "@/edge-handle/edge-handle";
import { nearestSlotIndex, computeEdgeSlotCenters } from "@/edge-slots/edge-slots";
import type { EdgeGroup, EdgePosition, Library } from "@/library/types";
import { resolveEdgeGroupFlyout } from "@/placement/placement";
import { useLauncherStore } from "@/store/launcher-store";
import { LinkItem } from "./link-item";

const DRAG_THRESHOLD_PX = 6;
const HANDLE_SIZE_PX = 32;
const HOVER_BRIDGE_PX = 10;

type EdgeGroupHandleProps = {
  edge: EdgePosition;
  group: EdgeGroup;
  library: Library;
  centerPx: number;
  groupCount: number;
  rimLengthPx: number;
  containerRef: RefObject<HTMLDivElement | null>;
  onReorder: (targetSlotIndex: number) => void;
};

const flyoutShellClass: Record<EdgePosition, string> = {
  left: "absolute left-full top-1/2 z-30 flex -translate-y-1/2 items-center",
  top: "absolute top-full left-1/2 z-30 flex -translate-x-1/2 flex-col items-center",
  bottom: "absolute bottom-full left-1/2 z-30 flex -translate-x-1/2 flex-col items-center",
};

const hoverBridgeClass: Record<EdgePosition, string> = {
  left: "w-2.5 shrink-0 self-stretch",
  top: "h-2.5 w-8 shrink-0",
  bottom: "h-2.5 w-8 shrink-0",
};

function axisPosition(
  edge: EdgePosition,
  clientX: number,
  clientY: number,
  container: DOMRect,
): number {
  if (edge === "left") {
    return clientY - container.top;
  }
  return clientX - container.left;
}

function handlePositionStyle(edge: EdgePosition, centerPx: number): CSSProperties {
  if (edge === "left") {
    return {
      top: centerPx,
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
  }

  return {
    left: centerPx,
    top: "50%",
    transform: "translate(-50%, -50%)",
  };
}

export function EdgeGroupHandle({
  edge,
  group,
  library,
  centerPx,
  groupCount,
  rimLengthPx,
  containerRef,
  onReorder,
}: EdgeGroupHandleProps) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startAxis: number;
    dragged: boolean;
  } | null>(null);
  const openFromEdgeGroup = useLauncherStore((state) => state.openFromEdgeGroup);
  const display = resolveEdgeHandleDisplay(group);
  const { links, hasMore } = resolveEdgeGroupFlyout(library, edge, group.id);
  const open = hovered || pinned;

  function finishDrag(axisPx: number) {
    const slotCenters = computeEdgeSlotCenters(groupCount, rimLengthPx);
    onReorder(nearestSlotIndex(axisPx, slotCenters));
  }

  function closeUnlessPinned() {
    if (!pinned && !dragRef.current) {
      setHovered(false);
    }
  }

  return (
    <div className="absolute z-20" style={handlePositionStyle(edge, centerPx)}>
      <div
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={closeUnlessPinned}
      >
        <button
          type="button"
          aria-label={group.name}
          aria-expanded={open}
          className="flex cursor-grab items-center justify-center rounded-lg border border-black/10 bg-[color:var(--qs-color-surface)]/80 text-sm shadow-sm backdrop-blur-sm transition hover:border-black/20 hover:bg-[color:var(--qs-color-surface)]/95 active:cursor-grabbing"
          style={{ width: HANDLE_SIZE_PX, height: HANDLE_SIZE_PX }}
          onClick={() => {
            if (dragRef.current?.dragged) {
              return;
            }
            setPinned((value) => !value);
          }}
          onPointerDown={(event) => {
            const container = containerRef.current?.getBoundingClientRect();
            if (!container) {
              return;
            }

            dragRef.current = {
              pointerId: event.pointerId,
              startAxis: axisPosition(edge, event.clientX, event.clientY, container),
              dragged: false,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            const drag = dragRef.current;
            const container = containerRef.current?.getBoundingClientRect();
            if (!drag || !container || drag.pointerId !== event.pointerId) {
              return;
            }

            const axis = axisPosition(edge, event.clientX, event.clientY, container);
            if (Math.abs(axis - drag.startAxis) > DRAG_THRESHOLD_PX) {
              drag.dragged = true;
            }
          }}
          onPointerUp={(event) => {
            const drag = dragRef.current;
            const container = containerRef.current?.getBoundingClientRect();
            if (!drag || !container || drag.pointerId !== event.pointerId) {
              return;
            }

            event.currentTarget.releasePointerCapture(event.pointerId);
            if (drag.dragged) {
              finishDrag(axisPosition(edge, event.clientX, event.clientY, container));
            }
            dragRef.current = null;
          }}
          onPointerCancel={() => {
            dragRef.current = null;
          }}
        >
          {display.kind === "image" ? (
            <img
              src={display.url}
              alt=""
              width={HANDLE_SIZE_PX - 10}
              height={HANDLE_SIZE_PX - 10}
              className="rounded-md object-cover"
            />
          ) : (
            <span className="flex h-full w-full select-none items-center justify-center text-base leading-none">
              {display.text}
            </span>
          )}
        </button>

        {open ? (
          <div className={flyoutShellClass[edge]} style={{ pointerEvents: "auto" }}>
            <div className={hoverBridgeClass[edge]} aria-hidden />
            <nav
              className="flex max-h-[min(80vh,32rem)] w-64 flex-col gap-0.5 overflow-y-auto rounded-[var(--qs-border-radius)] border border-black/10 bg-[color:var(--qs-color-surface)]/92 p-2 shadow-lg backdrop-blur-xl"
              style={{
                marginLeft: edge === "left" ? -HOVER_BRIDGE_PX / 2 : undefined,
                marginTop: edge === "top" ? -HOVER_BRIDGE_PX / 2 : undefined,
                marginBottom: edge === "bottom" ? -HOVER_BRIDGE_PX / 2 : undefined,
              }}
            >
              <p className="px-2 pb-1 pt-1 text-xs font-medium uppercase tracking-wide opacity-50">
                {group.name}
              </p>
              {links.map((link) => (
                <LinkItem key={link.id} link={link} />
              ))}
              {hasMore ? (
                <button
                  type="button"
                  className="mt-1 rounded-[var(--qs-border-radius)] px-2 py-1.5 text-left text-sm text-[color:var(--qs-color-accent)] hover:bg-black/5"
                  onClick={() => openFromEdgeGroup(edge, group.id)}
                >
                  See more…
                </button>
              ) : null}
              {pinned ? (
                <button
                  type="button"
                  className="mt-1 px-2 py-1 text-xs opacity-60 hover:opacity-100"
                  onClick={() => setPinned(false)}
                >
                  Dismiss
                </button>
              ) : null}
            </nav>
          </div>
        ) : null}
      </div>
    </div>
  );
}
