"use client";

import { useEffect, useState } from "react";
import type { Workspace } from "@/library/types";
import { formatClockDisplay } from "@/canvas-widgets/clock";
import { listEnabledCanvasWidgets } from "@/canvas-widgets/config";
import { pickQuote } from "@/canvas-widgets/quote";
import { formatWelcomeMessage } from "@/canvas-widgets/welcome";
import { CanvasFocusTasksWidget } from "./canvas-focus-tasks-widget";
import { CanvasNowPlayingWidget } from "./canvas-now-playing-widget";
import { CanvasPomodoroWidget } from "./canvas-pomodoro-widget";

type CanvasWidgetStackProps = {
  workspace: Workspace;
};

function CanvasClockWidget() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const { time, date } = formatClockDisplay(now);

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <p className="text-5xl font-light tabular-nums tracking-tight text-[color:var(--qs-color-text)]">
        {time}
      </p>
      <p className="text-sm text-[color:color-mix(in_srgb,var(--qs-color-text)_72%,transparent)]">
        {date}
      </p>
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
    <p className="text-lg text-[color:var(--qs-color-text)]">
      {formatWelcomeMessage(workspaceName, now)}
    </p>
  );
}

function CanvasQuoteWidget() {
  const [quote] = useState(() => pickQuote(Math.floor(Date.now() / 86_400_000)));

  return (
    <p className="max-w-md text-center text-sm italic text-[color:color-mix(in_srgb,var(--qs-color-text)_68%,transparent)]">
      {quote.text}
    </p>
  );
}

export function CanvasWidgetStack({ workspace }: CanvasWidgetStackProps) {
  const enabled = listEnabledCanvasWidgets(workspace);

  if (enabled.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {enabled.map((widgetId) => {
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
      })}
    </div>
  );
}
