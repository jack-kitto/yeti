"use client";

import { useEffect, useState } from "react";
import type { Workspace } from "@/library/types";
import { formatClockDisplay } from "@/canvas-widgets/clock";
import { listEnabledCanvasWidgets } from "@/canvas-widgets/config";
import { pickQuote } from "@/canvas-widgets/quote";
import { formatWelcomeMessage } from "@/canvas-widgets/welcome";
import { CanvasFocusTasksWidget } from "./canvas-focus-tasks-widget";
import { CanvasNowPlayingWidget } from "./canvas-now-playing-widget";
import { CanvasPomodoroWidget, isCanvasTimerActive } from "./canvas-pomodoro-widget";

type CanvasWidgetStackProps = {
  workspace: Workspace;
};

const CENTER_WIDGETS = ["welcome", "quote", "nowPlaying"] as const;

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

export function CanvasWidgetStack({ workspace }: CanvasWidgetStackProps) {
  const enabled = new Set(listEnabledCanvasWidgets(workspace));

  if (enabled.size === 0) {
    return null;
  }

  const timerActive = isCanvasTimerActive(workspace);
  const showWallClock = enabled.has("clock") && !timerActive;
  const showTimerClock = enabled.has("pomodoro") && timerActive;
  const centerIds = CENTER_WIDGETS.filter((widgetId) => enabled.has(widgetId));
  const showTasks = enabled.has("focusTasks");

  return (
    <div className="canvas-widget-stage">
      {showTasks ? (
        <div className="canvas-widget-tasks-corner">
          <CanvasFocusTasksWidget workspace={workspace} />
        </div>
      ) : null}

      {showWallClock || showTimerClock || centerIds.length > 0 ? (
        <div className="canvas-widget-foreground">
          {showTimerClock ? <CanvasPomodoroWidget workspace={workspace} /> : null}
          {showWallClock ? <CanvasClockWidget /> : null}
          {centerIds.map((widgetId) => {
            switch (widgetId) {
              case "welcome":
                return <CanvasWelcomeWidget key={widgetId} workspaceName={workspace.name} />;
              case "quote":
                return <CanvasQuoteWidget key={widgetId} />;
              case "nowPlaying":
                return <CanvasNowPlayingWidget key={widgetId} workspace={workspace} />;
            }
          })}
        </div>
      ) : null}
    </div>
  );
}
