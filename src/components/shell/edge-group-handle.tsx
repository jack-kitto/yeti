"use client";

import { useRef, useState, type CSSProperties, type RefObject } from "react";
import { resolveEdgeHandleDisplay } from "@/edge-handle/edge-handle";
import {
  EDGE_HANDLE_SIZE_PX,
  nearestSlotIndex,
  computeEdgeSlotCenters,
} from "@/edge-slots/edge-slots";
import type { EdgeGroup, EdgePosition, Library } from "@/library/types";
import { resolveEdgeGroupFlyout } from "@/placement/placement";
import { useLauncherStore } from "@/store/launcher-store";
import { LinkItem } from "./link-item";

const DRAG_THRESHOLD_PX = 6;

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

const flyoutClass: Record<EdgePosition, string> = {
  left:
    "left-full top-1/2 ml-2 max-h-[min(80vh,32rem)] -translate-y-1/2 rounded-r-[var(--qs-border-radius)]",
  top: "top-full left-1/2 mt-2 max-h-[min(60vh,24rem)] -translate-x-1/2 rounded-b-[var(--qs-border-radius)]",
  bottom:
    "bottom-full left-1/2 mb-2 max-h-[min(60vh,24rem)] -translate-x-1/2 rounded-t-[var(--qs-border-radius)]",
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

function handlePositionStyle(
  edge: EdgePosition,
  centerPx: number,
): CSSProperties {
  if (edge === "left") {
    return {
      top: centerPx,
      left: 0,
      transform: "translateY(-50%)",
    };
  }
  if (edge === "top") {
    return {
      left: centerPx,
      top: 0,
      transform: "translateX(-50%)",
    };
  }
  return {
    left: centerPx,
    bottom: 0,
    transform: "translateX(-50%)",
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

  return (
    <div
      className="absolute z-20"
      style={handlePositionStyle(edge, centerPx)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        if (!dragRef.current) {
          setHovered(false);
        }
      }}
    >
      <button
        type="button"
        aria-label={group.name}
        aria-expanded={open}
        className="flex h-10 w-10 cursor-grab items-center justify-center rounded-full border border-white/25 bg-[color:var(--qs-color-surface)]/90 text-sm shadow-md backdrop-blur-sm transition hover:border-white/40 active:cursor-grabbing"
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
          setHovered(false);
        }}
        onPointerCancel={() => {
          dragRef.current = null;
        }}
      >
        {display.kind === "image" ? (
          <img
            src={display.url}
            alt=""
            width={EDGE_HANDLE_SIZE_PX - 12}
            height={EDGE_HANDLE_SIZE_PX - 12}
            className="rounded-full"
          />
        ) : (
          <span className="select-none leading-none">{display.text}</span>
        )}
      </button>

      {open ? (
        <nav
          className={`absolute flex w-56 flex-col gap-1 overflow-y-auto border border-white/20 bg-[color:var(--qs-color-surface)]/90 p-3 shadow-lg backdrop-blur-md ${flyoutClass[edge]}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            if (!pinned) {
              setHovered(false);
            }
          }}
        >
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
      ) : null}
    </div>
  );
}
