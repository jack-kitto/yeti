"use client";

import { useEffect, useState } from "react";
import {
  advancePomodoroPhase,
  formatTimerSeconds,
  isPomodoroPhaseComplete,
  pausePomodoro,
  remainingSeconds,
  resetPomodoro,
  resolveFocusSplit,
  startPomodoro,
} from "@/internal-tools/pomodoro";
import type { PomodoroState, WorkspaceInternalTools } from "@/internal-tools/types";

type PomodoroFlyoutProps = {
  internalTools: WorkspaceInternalTools;
  onChange: (internalTools: WorkspaceInternalTools) => void;
};

export function PomodoroFlyout({ internalTools, onChange }: PomodoroFlyoutProps) {
  const pomodoro = internalTools.pomodoro;
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!pomodoro.running) {
      return;
    }

    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, [pomodoro.running]);

  useEffect(() => {
    if (!isPomodoroPhaseComplete(pomodoro, now)) {
      return;
    }

    onChange({
      ...internalTools,
      pomodoro: advancePomodoroPhase(pomodoro),
    });
  }, [internalTools, now, onChange, pomodoro]);

  const split = resolveFocusSplit(pomodoro.splitId, internalTools);
  const idleSeconds =
    pomodoro.phase === "work"
      ? split.workMinutes * 60
      : pomodoro.phase === "shortBreak"
        ? split.shortBreakMinutes * 60
        : split.longBreakMinutes * 60;
  const seconds = pomodoro.running ? remainingSeconds(pomodoro, now) : idleSeconds;

  return (
    <div className="shell-tool-flyout">
      <p className="shell-flyout-title">Pomodoro</p>
      <p className="shell-tool-timer" aria-live="polite">
        {formatTimerSeconds(seconds)}
      </p>
      <div className="shell-tool-actions">
        {pomodoro.running ? (
          <button
            type="button"
            className="shell-flyout-more"
            onClick={() =>
              onChange({
                ...internalTools,
                pomodoro: pausePomodoro(pomodoro),
              })
            }
          >
            Pause
          </button>
        ) : (
          <button
            type="button"
            className="shell-flyout-more"
            onClick={() =>
              onChange({
                ...internalTools,
                pomodoro: startPomodoro(pomodoro, new Date(), split),
              })
            }
          >
            Start
          </button>
        )}
        <button
          type="button"
          className="shell-flyout-dismiss"
          onClick={() =>
            onChange({
              ...internalTools,
              pomodoro: resetPomodoro(pomodoro),
            })
          }
        >
          Reset
        </button>
      </div>
    </div>
  );
}
