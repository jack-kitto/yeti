"use client";

import type { Workspace } from "@/library/types";
import type { CanvasZoneLayout } from "@/canvas-widgets/zone-layout";
import { CANVAS_ZONES } from "@/canvas-widgets/zone-layout";
import type { CanvasWidgetId } from "@/canvas-widgets/types";
import { editorialFont } from "@/theme/editorial-font";
import { CanvasFocusTasksWidget } from "./canvas-focus-tasks-widget";
import { CanvasNowPlayingWidget } from "./canvas-now-playing-widget";
import {
  CanvasClockDateHeroWidget,
  CanvasClockTimeWidget,
  CanvasQuoteWidget,
  CanvasWelcomeWidget,
} from "./canvas-widget-parts";

type EditorialCanvasStackProps = {
  workspace: Workspace;
  layout: CanvasZoneLayout;
};

function isWidgetInLayout(layout: CanvasZoneLayout, widgetId: CanvasWidgetId): boolean {
  return CANVAS_ZONES.some((zone) => layout[zone].includes(widgetId));
}

export function EditorialCanvasStack({ workspace, layout }: EditorialCanvasStackProps) {
  const showQuote = isWidgetInLayout(layout, "quote");
  const showNowPlaying = isWidgetInLayout(layout, "nowPlaying");
  const showTasks = isWidgetInLayout(layout, "focusTasks");
  const showWelcome = isWidgetInLayout(layout, "welcome");
  const showClock = isWidgetInLayout(layout, "clock");

  return (
    <div
      className={`canvas-widget-stage canvas-widget-stage--editorial ${editorialFont.className}`}
      data-applied-preset="editorial"
    >
      <div className="canvas-editorial-corner canvas-editorial-tl">
        {showQuote ? <CanvasQuoteWidget /> : null}
        {showNowPlaying ? <CanvasNowPlayingWidget workspace={workspace} /> : null}
      </div>

      <div className="canvas-editorial-corner canvas-editorial-tr">
        {showTasks ? <CanvasFocusTasksWidget workspace={workspace} /> : null}
      </div>

      <div className="canvas-editorial-corner canvas-editorial-bl">
        {showWelcome ? <CanvasWelcomeWidget workspaceName={workspace.name} /> : null}
        {showClock ? <CanvasClockTimeWidget /> : null}
      </div>

      <div className="canvas-editorial-corner canvas-editorial-br">
        {showClock ? <CanvasClockDateHeroWidget /> : null}
      </div>
    </div>
  );
}
