"use client";

import { useMutateLibrary } from "@/hooks/use-library";
import {
  CANVAS_WIDGET_IDS,
  setCanvasWidgetEnabled,
  type CanvasWidgetId,
} from "@/canvas-widgets/config";
import { CANVAS_WIDGET_TOGGLE_ROW_CLASS } from "@/canvas-widgets/settings-layout";
import type { Library } from "@/library/types";

const WIDGET_LABELS: Record<CanvasWidgetId, string> = {
  clock: "Clock / date",
  welcome: "Welcome message",
  quote: "Quote",
  nowPlaying: "Now playing",
};

type ShellConfigCanvasWidgetsProps = {
  library: Library;
};

export function ShellConfigCanvasWidgets({ library }: ShellConfigCanvasWidgetsProps) {
  const mutateLibrary = useMutateLibrary();
  const workspaceId = library.activeWorkspaceId;
  const workspace = library.workspaces.find((entry) => entry.id === workspaceId)!;

  function handleToggle(widgetId: CanvasWidgetId, enabled: boolean) {
    mutateLibrary.mutate((current) =>
      setCanvasWidgetEnabled(current, workspaceId, widgetId, enabled),
    );
  }

  return (
    <div className="shell-config-dialog-section">
      <p className="shell-config-dialog-copy">
        Choose which ambient widgets appear on the canvas for this workspace.
      </p>

      <ul className="shell-config-catalog">
        {CANVAS_WIDGET_IDS.map((widgetId) => (
          <li key={widgetId} className="shell-config-catalog-item">
            <label className={CANVAS_WIDGET_TOGGLE_ROW_CLASS}>
              <input
                type="checkbox"
                checked={workspace.canvasWidgets[widgetId]}
                onChange={(event) => handleToggle(widgetId, event.target.checked)}
              />
              <span className="shell-config-catalog-title">{WIDGET_LABELS[widgetId]}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
