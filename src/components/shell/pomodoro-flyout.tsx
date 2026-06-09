"use client";

import { useEffect, useState } from "react";
import {
  advancePomodoroPhase,
  BUILTIN_FOCUS_SPLITS,
  CUSTOM_SPLIT_ID,
  formatTimerSeconds,
  isPomodoroPhaseComplete,
  pausePomodoro,
  remainingSeconds,
  resetPomodoro,
  resolveFocusSplit,
  setCustomFocusSplit,
  setPomodoroSplit,
  startPomodoro,
} from "@/internal-tools/pomodoro";
import type { PomodoroState, WorkspaceInternalTools } from "@/internal-tools/types";

type PomodoroFlyoutProps = {
  internalTools: WorkspaceInternalTools;
  onChange: (internalTools: WorkspaceInternalTools) => void;
};

const DEFAULT_CUSTOM_DRAFT = {
  label: "",
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
};

export function PomodoroFlyout({ internalTools, onChange }: PomodoroFlyoutProps) {
  const pomodoro = internalTools.pomodoro;
  const [now, setNow] = useState(() => new Date());
  const [customDraft, setCustomDraft] = useState(() => {
    const custom = internalTools.customFocusSplit;
    return custom
      ? {
          label: custom.label === "Custom" ? "" : custom.label,
          workMinutes: custom.workMinutes,
          shortBreakMinutes: custom.shortBreakMinutes,
          longBreakMinutes: custom.longBreakMinutes,
        }
      : DEFAULT_CUSTOM_DRAFT;
  });

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
      <fieldset className="shell-tool-split-picker">
        <legend className="shell-tool-split-label">Focus split</legend>
        <div className="shell-tool-split-options">
          {BUILTIN_FOCUS_SPLITS.map((option) => (
            <button
              key={option.id}
              type="button"
              className="shell-flyout-more"
              aria-pressed={pomodoro.splitId === option.id}
              onClick={() => onChange(setPomodoroSplit(internalTools, option.id))}
            >
              {option.label}
            </button>
          ))}
          <button
            type="button"
            className="shell-flyout-more"
            aria-pressed={pomodoro.splitId === CUSTOM_SPLIT_ID}
            onClick={() => {
              if (internalTools.customFocusSplit) {
                onChange(setPomodoroSplit(internalTools, CUSTOM_SPLIT_ID));
              }
            }}
          >
            Custom
          </button>
        </div>
      </fieldset>
      <form
        className="shell-tool-split-form"
        onSubmit={(event) => {
          event.preventDefault();
          const next = setCustomFocusSplit(internalTools, customDraft);
          if (next !== internalTools) {
            onChange(next);
          }
        }}
      >
        <label className="shell-tool-split-field">
          <span className="shell-tool-split-label">Label</span>
          <input
            type="text"
            value={customDraft.label}
            onChange={(event) =>
              setCustomDraft((draft) => ({ ...draft, label: event.target.value }))
            }
            placeholder="Custom"
            className="shell-config-input"
            aria-label="Custom split label"
          />
        </label>
        <div className="shell-tool-split-intervals">
          <label className="shell-tool-split-field">
            <span className="shell-tool-split-label">Work</span>
            <input
              type="number"
              min={1}
              max={60}
              value={customDraft.workMinutes}
              onChange={(event) =>
                setCustomDraft((draft) => ({
                  ...draft,
                  workMinutes: Number(event.target.value),
                }))
              }
              className="shell-config-input"
              aria-label="Work minutes"
            />
          </label>
          <label className="shell-tool-split-field">
            <span className="shell-tool-split-label">Short</span>
            <input
              type="number"
              min={1}
              max={30}
              value={customDraft.shortBreakMinutes}
              onChange={(event) =>
                setCustomDraft((draft) => ({
                  ...draft,
                  shortBreakMinutes: Number(event.target.value),
                }))
              }
              className="shell-config-input"
              aria-label="Short break minutes"
            />
          </label>
          <label className="shell-tool-split-field">
            <span className="shell-tool-split-label">Long</span>
            <input
              type="number"
              min={1}
              max={30}
              value={customDraft.longBreakMinutes}
              onChange={(event) =>
                setCustomDraft((draft) => ({
                  ...draft,
                  longBreakMinutes: Number(event.target.value),
                }))
              }
              className="shell-config-input"
              aria-label="Long break minutes"
            />
          </label>
        </div>
        <button type="submit" className="shell-flyout-more">
          Save custom split
        </button>
      </form>
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
