"use client";

import { useEffect, useId, useState } from "react";
import type { Theme } from "@/library/types";
import { subscribeShellFrame } from "@/shell-frame/shell-animation";
import type { RenderPocket, ShellLayout } from "@/shell-frame/layout";
import { frameShellRingSvgD } from "@/shell-frame/shell-ring-path";
import { resolveTheme } from "@/theme/theme-defaults";

type ShellRimBackdropProps = {
  theme: Theme;
};

type FrameState = {
  layout: ShellLayout;
  pocket: RenderPocket;
};

export function ShellRimBackdrop({ theme }: ShellRimBackdropProps) {
  const maskId = useId().replace(/:/g, "");
  const resolved = resolveTheme(theme);
  const [frame, setFrame] = useState<FrameState | null>(null);

  useEffect(
    () =>
      subscribeShellFrame(({ layout, pocket }) => {
        setFrame({ layout, pocket });
      }),
    [],
  );

  if (resolved.shellSurface === "solid" || !frame) {
    return null;
  }

  const ringPath = frameShellRingSvgD(frame.layout, frame.pocket);

  return (
    <svg
      className="shell-rim-backdrop"
      width={frame.layout.w}
      height={frame.layout.h}
      viewBox={`0 0 ${frame.layout.w} ${frame.layout.h}`}
      aria-hidden
    >
      <defs>
        <mask id={maskId}>
          <path d={ringPath} fill="white" fillRule="evenodd" />
        </mask>
      </defs>
      <foreignObject
        width={frame.layout.w}
        height={frame.layout.h}
        mask={`url(#${maskId})`}
      >
        <div
          className="shell-rim-backdrop-fill"
          style={{
            width: `${frame.layout.w}px`,
            height: `${frame.layout.h}px`,
          }}
        />
      </foreignObject>
    </svg>
  );
}
