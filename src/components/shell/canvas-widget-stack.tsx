"use client";

import { useEffect, useState } from "react";
import type { Workspace } from "@/library/types";
import { formatClockDisplay } from "@/canvas-widgets/clock";
import { pickQuote } from "@/canvas-widgets/quote";
import { formatWelcomeMessage } from "@/canvas-widgets/welcome";
import {
  buildCanvasZoneLayout,
  CANVAS_ZONES,
  type CanvasZoneLayout,
} from "@/canvas-widgets/zone-layout";
import type { CanvasWidgetId } from "@/canvas-widgets/types";
import type { CanvasZone } from "@/library/types";
import { CanvasFocusTasksWidget } from "./canvas-focus-tasks-widget";
import { CanvasNowPlayingWidget } from "./canvas-now-playing-widget";
import { CanvasPomodoroWidget } from "./canvas-pomodoro-widget";

type CanvasWidgetStackProps = {
  workspace: Workspace;
};

const ZONE_CLASS: Record<CanvasZone, string> = {
  "upper-center": "canvas-zone-upper-center",
  center: "canvas-zone-center",
  "lower-left": "canvas-zone-lower-left",
  "lower-right": "canvas-zone-lower-right",
  "bottom-center": "canvas-zone-bottom-center",
};

function CanvasClockWidget() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const { time, date } = formatClockDisplay(now);

  return (
    <div className="canvas-widget canvas-widget-clock">
      <p className="canvas-widget-clock-time">{time}</p>
      <p className="canvas-widget-clock-date">{date}</p>
    </div>
  );
}

function CanvasWelcomeWidget({ workspaceName }: { workspaceName: string }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <p className="canvas-widget canvas-widget-welcome">{formatWelcomeMessage(workspaceName, now)}</p>
  );
}

function CanvasQuoteWidget() {
  const [quote] = useState(() => pickQuote(Math.floor(Date.now() / 86_400_000)));

  return <p className="canvas-widget canvas-widget-quote">{quote.text}</p>;
}

function renderCanvasWidget(widgetId: CanvasWidgetId, workspace: Workspace) {
  switch (widgetId) {
    case "clock":
      return <CanvasClockWidget key={widgetId} />;
    case "welcome":
      return <CanvasWelcomeWidget key={widgetId} workspaceName={workspace.name} />;
    case "quote":
      return <CanvasQuoteWidget key={widgetId} />;
    case "nowPlaying":
      return <CanvasNowPlayingWidget key={widgetId} workspace={workspace} />;
    case "pomodoro":
      return <CanvasPomodoroWidget key={widgetId} workspace={workspace} />;
    case "focusTasks":
      return <CanvasFocusTasksWidget key={widgetId} workspace={workspace} />;
  }
}

function hasVisibleWidgets(layout: CanvasZoneLayout): boolean {
  return CANVAS_ZONES.some((zone) => layout[zone].length > 0);
}

export function CanvasWidgetStack({ workspace }: CanvasWidgetStackProps) {
  const layout = buildCanvasZoneLayout(workspace);

  if (!hasVisibleWidgets(layout)) {
    return null;
  }

  return (
    <div
      className="canvas-widget-stage"
      data-applied-preset={workspace.theme.appliedPresetId ?? undefined}
    >
      {CANVAS_ZONES.map((zone) => {
        const widgets = layout[zone];
        if (widgets.length === 0) {
          return null;
        }

        return (
          <div key={zone} className={`canvas-zone ${ZONE_CLASS[zone]}`}>
            {widgets.map((widgetId) => renderCanvasWidget(widgetId, workspace))}
          </div>
        );
      })}
    </div>
  );
}
