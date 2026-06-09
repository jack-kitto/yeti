"use client";

import { useState } from "react";
import {
  TASKS_FLYOUT_FORM_CLASS,
  TASKS_FLYOUT_LIST_SCROLL_CLASS,
} from "@/internal-tools/tasks-flyout-layout";
import { addFocusTask, completeFocusTask, listTodayTasks } from "@/internal-tools/tasks";
import type { WorkspaceInternalTools } from "@/internal-tools/types";

type TasksFlyoutProps = {
  internalTools: WorkspaceInternalTools;
  onChange: (internalTools: WorkspaceInternalTools) => void;
};

export function TasksFlyout({ internalTools, onChange }: TasksFlyoutProps) {
  const [draft, setDraft] = useState("");
  const todayTasks = listTodayTasks(internalTools);

  function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = addFocusTask(internalTools, draft);
    if (next === internalTools) {
      return;
    }
    onChange(next);
    setDraft("");
  }

  return (
    <div className="shell-tool-flyout">
      <p className="shell-flyout-title">Focus tasks</p>
      <div className={TASKS_FLYOUT_LIST_SCROLL_CLASS}>
        <ul className="shell-tool-task-list">
          {todayTasks.map((task) => (
            <li key={task.id} className="shell-tool-task-item">
              <span>{task.title}</span>
              <button
                type="button"
                className="shell-flyout-more"
                onClick={() => onChange(completeFocusTask(internalTools, task.id))}
              >
                Done
              </button>
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
        <button type="submit" className="shell-flyout-more" disabled={!draft.trim()}>
          Add
        </button>
      </form>
    </div>
  );
}
