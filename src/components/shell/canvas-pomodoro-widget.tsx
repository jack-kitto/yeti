"use client";

import { useEffect, useState } from "react";
import { canvasPomodoroFillLevel } from "@/canvas-widgets/pomodoro";
import { useLibrary, useSaveLibrary } from "@/hooks/use-library";
import type { Workspace } from "@/library/types";
import {
  advancePomodoroPhase,
  displayPomodoroSeconds,
  formatFocusSplitSummary,
  formatPomodoroPhaseLabel,
  formatTimerSeconds,
  isPomodoroPhaseComplete,
  pausePomodoro,
  playChimeIfEnabled,
  resolveFocusSplit,
  startPomodoro,
} from "@/internal-tools/pomodoro";
import { getActiveFocusTask } from "@/internal-tools/tasks";

type CanvasPomodoroWidgetProps = {
  workspace: Workspace;
};

export function CanvasPomodoroWidget({ workspace }: CanvasPomodoroWidgetProps) {
  const { data: library } = useLibrary();
  const saveLibrary = useSaveLibrary();
  const [now, setNow] = useState(() => new Date());
  const pomodoro = workspace.internalTools.pomodoro;
  const split = resolveFocusSplit(pomodoro.splitId, workspace.internalTools);
  const activeTask = getActiveFocusTask(workspace.internalTools);
  const seconds = displayPomodoroSeconds(pomodoro, split, now);
  const fillLevel = canvasPomodoroFillLevel(pomodoro, workspace.internalTools, now);

  useEffect(() => {
    if (!pomodoro.running) {
      return;
    }

    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, [pomodoro.running]);

  useEffect(() => {
    if (!library || !isPomodoroPhaseComplete(pomodoro, now)) {
      return;
    }

    playChimeIfEnabled(pomodoro.chimeEnabled);
    saveLibrary.mutate({
      ...library,
      workspaces: library.workspaces.map((entry) =>
        entry.id === workspace.id
          ? {
              ...entry,
              internalTools: {
                ...entry.internalTools,
                pomodoro: advancePomodoroPhase(pomodoro),
              },
            }
          : entry,
      ),
    });
  }, [library, now, pomodoro, saveLibrary, workspace.id]);

  function updatePomodoro(nextPomodoro: typeof pomodoro) {
    if (!library) {
      return;
    }

    saveLibrary.mutate({
      ...library,
      workspaces: library.workspaces.map((entry) =>
        entry.id === workspace.id
          ? {
              ...entry,
              internalTools: {
                ...entry.internalTools,
                pomodoro: nextPomodoro,
              },
            }
          : entry,
      ),
    });
  }

  return (
    <div className="canvas-pomodoro">
      <div className="canvas-pomodoro-hourglass" aria-hidden>
        <div className="canvas-pomodoro-hourglass-top" />
        <div className="canvas-pomodoro-hourglass-neck" />
        <div className="canvas-pomodoro-hourglass-bottom">
          <div
            className="canvas-pomodoro-hourglass-fill"
            style={{ transform: `scaleY(${fillLevel})` }}
          />
        </div>
      </div>
      <div className="canvas-pomodoro-copy">
        <p className="canvas-pomodoro-phase">{formatPomodoroPhaseLabel(pomodoro.phase)}</p>
        <p className="canvas-pomodoro-timer" aria-live="polite">
          {formatTimerSeconds(seconds)}
        </p>
        <p className="canvas-pomodoro-split">
          {split.label} · {formatFocusSplitSummary(split)}
        </p>
        {activeTask ? <p className="canvas-pomodoro-task">{activeTask.title}</p> : null}
      </div>
      <div className="canvas-pomodoro-actions">
        {pomodoro.running ? (
          <button
            type="button"
            className="canvas-pomodoro-action"
            onClick={() => updatePomodoro(pausePomodoro(pomodoro))}
          >
            Pause
          </button>
        ) : (
          <button
            type="button"
            className="canvas-pomodoro-action"
            onClick={() => updatePomodoro(startPomodoro(pomodoro, new Date(), split))}
          >
            Start
          </button>
        )}
      </div>
    </div>
  );
}
