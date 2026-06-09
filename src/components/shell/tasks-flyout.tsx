"use client";

import { useState } from "react";
import {
  TASKS_FLYOUT_FORM_CLASS,
  TASKS_FLYOUT_LIST_SCROLL_CLASS,
} from "@/internal-tools/tasks-flyout-layout";
import {
  addFocusTask,
  completeFocusTask,
  listBacklogTasks,
  listTodayTasks,
  moveFocusTask,
  setFocusTaskEstimate,
  setFocusTaskToday,
  startFocusOnTask,
} from "@/internal-tools/tasks";
import type { WorkspaceInternalTools } from "@/internal-tools/types";

type TasksFlyoutProps = {
  internalTools: WorkspaceInternalTools;
  onChange: (internalTools: WorkspaceInternalTools) => void;
};

type TasksView = "today" | "backlog";

export function TasksFlyout({ internalTools, onChange }: TasksFlyoutProps) {
  const [draft, setDraft] = useState("");
  const [estimateDraft, setEstimateDraft] = useState("");
  const [view, setView] = useState<TasksView>("today");
  const visibleTasks = view === "today" ? listTodayTasks(internalTools) : listBacklogTasks(internalTools);

  function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const estimateMinutes = estimateDraft.trim() ? Number(estimateDraft) : undefined;
    const next = addFocusTask(internalTools, draft, crypto.randomUUID(), estimateMinutes);
    if (next === internalTools) {
      return;
    }
    onChange(next);
    setDraft("");
    setEstimateDraft("");
  }

  return (
    <div className="shell-tool-flyout">
      <p className="shell-flyout-title">Focus tasks</p>
      <div className="shell-tool-task-view-toggle" role="group" aria-label="Task list view">
        <button
          type="button"
          className="shell-flyout-more"
          aria-pressed={view === "today"}
          onClick={() => setView("today")}
        >
          Today
        </button>
        <button
          type="button"
          className="shell-flyout-more"
          aria-pressed={view === "backlog"}
          onClick={() => setView("backlog")}
        >
          Backlog
        </button>
      </div>
      <div className={TASKS_FLYOUT_LIST_SCROLL_CLASS}>
        <ul className="shell-tool-task-list">
          {visibleTasks.map((task, index) => (
            <li key={task.id} className="shell-tool-task-item">
              <div className="shell-tool-task-main">
                <span>{task.title}</span>
                <label className="shell-tool-task-estimate-field">
                  <span className="shell-tool-split-label">Est (min)</span>
                  <input
                    type="number"
                    min={1}
                    value={task.estimateMinutes ?? ""}
                    onChange={(event) => {
                      const raw = event.target.value;
                      const next = setFocusTaskEstimate(
                        internalTools,
                        task.id,
                        raw ? Number(raw) : undefined,
                      );
                      if (next !== internalTools) {
                        onChange(next);
                      }
                    }}
                    placeholder="—"
                    className="shell-config-input"
                    aria-label={`Estimate for ${task.title}`}
                  />
                </label>
              </div>
              <div className="shell-tool-task-actions">
                <button
                  type="button"
                  className="shell-flyout-dismiss"
                  aria-label={`Move ${task.title} up`}
                  disabled={index === 0}
                  onClick={() => onChange(moveFocusTask(internalTools, task.id, index - 1))}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="shell-flyout-dismiss"
                  aria-label={`Move ${task.title} down`}
                  disabled={index === visibleTasks.length - 1}
                  onClick={() => onChange(moveFocusTask(internalTools, task.id, index + 1))}
                >
                  Down
                </button>
                <button
                  type="button"
                  className="shell-flyout-more"
                  onClick={() =>
                    onChange(setFocusTaskToday(internalTools, task.id, view !== "today"))
                  }
                >
                  {view === "today" ? "Backlog" : "Today"}
                </button>
                <button
                  type="button"
                  className="shell-flyout-more"
                  onClick={() => onChange(startFocusOnTask(internalTools, task.id, new Date()))}
                >
                  Start focus
                </button>
                <button
                  type="button"
                  className="shell-flyout-more"
                  onClick={() => onChange(completeFocusTask(internalTools, task.id))}
                >
                  Done
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form className={TASKS_FLYOUT_FORM_CLASS} onSubmit={handleAdd}>
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add a focus task…"
          className="shell-config-input"
          aria-label="New focus task"
        />
        <label className="shell-tool-task-estimate-field">
          <span className="shell-tool-split-label">Estimate (minutes)</span>
          <input
            type="number"
            min={1}
            value={estimateDraft}
            onChange={(event) => setEstimateDraft(event.target.value)}
            placeholder="Optional"
            className="shell-config-input"
            aria-label="New focus task estimate"
          />
        </label>
        <button type="submit" className="shell-flyout-more" disabled={!draft.trim()}>
          Add
        </button>
      </form>
    </div>
  );
}
