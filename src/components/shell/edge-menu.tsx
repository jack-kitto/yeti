"use client";

import { useState } from "react";
import { resolveEdgeLinks } from "@/placement/placement";
import type { EdgePosition, Library } from "@/library/types";
import { LinkItem } from "./link-item";

type EdgeMenuProps = {
  edge: EdgePosition;
  library: Library;
};

const edgeLayout: Record<
  EdgePosition,
  { container: string; handle: string; flyout: string }
> = {
  left: {
    container: "absolute left-0 top-0 bottom-0 flex-row",
    handle: "h-full w-3 cursor-e-resize",
    flyout:
      "left-3 top-1/2 max-h-[min(80vh,32rem)] -translate-y-1/2 rounded-r-[var(--qs-border-radius)]",
  },
  top: {
    container: "absolute top-0 left-0 right-0 flex-col",
    handle: "w-full h-3 cursor-s-resize",
    flyout:
      "top-3 left-1/2 max-h-[min(60vh,24rem)] -translate-x-1/2 rounded-b-[var(--qs-border-radius)]",
  },
  bottom: {
    container: "absolute bottom-0 left-0 right-0 flex-col-reverse",
    handle: "w-full h-3 cursor-n-resize",
    flyout:
      "bottom-3 left-1/2 max-h-[min(60vh,24rem)] -translate-x-1/2 rounded-t-[var(--qs-border-radius)]",
  },
};

export function EdgeMenu({ edge, library }: EdgeMenuProps) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hovered || pinned;

  const { links, hasMore } = resolveEdgeLinks(library, edge);
  const layout = edgeLayout[edge];

  return (
    <div
      className={`z-20 flex ${layout.container}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        aria-label={`${edge} edge`}
        aria-expanded={open}
        className={`${layout.handle} border-0 bg-transparent p-0`}
        onClick={() => setPinned((value) => !value)}
      />

      {open ? (
        <nav
          className={`absolute flex w-56 flex-col gap-1 overflow-y-auto border border-white/20 bg-[color:var(--qs-color-surface)]/90 p-3 shadow-lg backdrop-blur-md ${layout.flyout}`}
        >
          {links.map((link) => (
            <LinkItem key={link.id} link={link} />
          ))}
          {hasMore ? (
            <button
              type="button"
              className="mt-1 rounded-[var(--qs-border-radius)] px-2 py-1.5 text-left text-sm text-[color:var(--qs-color-accent)] hover:bg-black/5"
              onClick={() => {
                /* launcher lands in issue 05 */
              }}
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
