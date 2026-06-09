"use client";

import { useEffect, useState } from "react";
import {
  formatTimerSeconds,
  getFocusSplit,
  pausePomodoro,
  remainingSeconds,
  resetPomodoro,
  startPomodoro,
} from "@/internal-tools/pomodoro";
import type { PomodoroState } from "@/internal-tools/types";

type PomodoroFlyoutProps = {
  pomodoro: PomodoroState;
  onChange: (pomodoro: PomodoroState) => void;
};

export function PomodoroFlyout({ pomodoro, onChange }: PomodoroFlyoutProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!pomodoro.running) {
      return;
    }

    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, [pomodoro.running]);

  const split = getFocusSplit(pomodoro.splitId);
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
            onClick={() => onChange(pausePomodoro(pomodoro))}
          >
            Pause
          </button>
        ) : (
          <button
            type="button"
            className="shell-flyout-more"
            onClick={() => onChange(startPomodoro(pomodoro, new Date()))}
          >
            Start
          </button>
        )}
        <button
          type="button"
          className="shell-flyout-dismiss"
          onClick={() => onChange(resetPomodoro(pomodoro))}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
