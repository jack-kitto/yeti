"use client";

import type { Workspace } from "@/library/types";
type PanelBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};
import { CanvasWidgetStack } from "./canvas-widget-stack";
import { ShellCanvas } from "./shell-canvas";

type ShellWorkspaceSurfaceProps = {
  workspace: Workspace;
  panelBounds: PanelBounds;
  className?: string;
  style?: React.CSSProperties;
};

export function ShellWorkspaceSurface({
  workspace,
  panelBounds,
  className,
  style,
}: ShellWorkspaceSurfaceProps) {
  return (
    <div className={className} style={style}>
      <ShellCanvas theme={workspace.theme} />
      <main
        className="shell-canvas-layer pointer-events-none absolute flex flex-col items-center px-8"
        style={{
          left: panelBounds.left,
          top: panelBounds.top,
          width: panelBounds.width,
          height: panelBounds.height,
        }}
      >
        <div className="pointer-events-none absolute inset-0 px-6 sm:px-8">
          <CanvasWidgetStack workspace={workspace} />
        </div>
      </main>
    </div>
  );
}
