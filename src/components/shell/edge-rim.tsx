"use client";

import { useEffect, useRef, useState } from "react";
import { computeEdgeSlotCenters } from "@/edge-slots/edge-slots";
import type { EdgePosition, Library } from "@/library/types";
import { resolveEdgeGroups } from "@/placement/placement";
import { EdgeGroupHandle } from "./edge-group-handle";

type EdgeRimProps = {
  edge: EdgePosition;
  library: Library;
  onReorderGroup: (groupId: string, targetSlotIndex: number) => void;
};

const rimClass: Record<EdgePosition, string> = {
  left: "absolute bottom-0 left-0 top-0 w-12",
  top: "absolute left-0 right-0 top-0 h-12",
  bottom: "absolute bottom-0 left-0 right-0 h-12",
};

export function EdgeRim({ edge, library, onReorderGroup }: EdgeRimProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rimLengthPx, setRimLengthPx] = useState(0);
  const groups = resolveEdgeGroups(library, edge);
  const slotCenters = computeEdgeSlotCenters(groups.length, rimLengthPx);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const measure = () => {
      const rect = element.getBoundingClientRect();
      setRimLengthPx(edge === "left" ? rect.height : rect.width);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [edge]);

  return (
    <div ref={containerRef} className={`z-10 ${rimClass[edge]}`} aria-label={`${edge} edge`}>
      {groups.map((group, index) => (
        <EdgeGroupHandle
          key={group.id}
          edge={edge}
          group={group}
          library={library}
          centerPx={slotCenters[index] ?? rimLengthPx / 2}
          groupCount={groups.length}
          rimLengthPx={rimLengthPx}
          containerRef={containerRef}
          onReorder={(targetSlotIndex) => onReorderGroup(group.id, targetSlotIndex)}
        />
      ))}
    </div>
  );
}
