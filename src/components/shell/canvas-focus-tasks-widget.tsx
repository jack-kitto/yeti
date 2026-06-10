"use client";

import {
  canStartFocusCountdown,
  formatCanvasFocusTaskEstimate,
  listCanvasFocusTasks,
} from "@/canvas-widgets/focus-tasks";
import { useLibrary, useSaveLibrary } from "@/hooks/use-library";
import type { Workspace } from "@/library/types";
import {
  completeFocusTask,
  startCountdownFromEstimate,
  startFocusOnTask,
} from "@/internal-tools/tasks";
import { getLatestShellZones } from "@/shell-frame/shell-state";
import { pinInternalToolZone } from "@/shell-frame/shell-zones";

type CanvasFocusTasksWidgetProps = {
  workspace: Workspace;
};

export function CanvasFocusTasksWidget({ workspace }: CanvasFocusTasksWidgetProps) {
  const { data: library } = useLibrary();
  const saveLibrary = useSaveLibrary();
  const tasks = listCanvasFocusTasks(workspace.internalTools);

  function updateInternalTools(nextInternalTools: typeof workspace.internalTools) {
    if (!library) {
      return;
    }

    saveLibrary.mutate({
      ...library,
      workspaces: library.workspaces.map((entry) =>
        entry.id === workspace.id
          ? {
              ...entry,
              internalTools: nextInternalTools,
            }
          : entry,
      ),
    });
  }

  function handleStartFocus(taskId: string) {
    updateInternalTools(startFocusOnTask(workspace.internalTools, taskId));
    pinInternalToolZone("pomodoro", getLatestShellZones());
  }

  if (tasks.length === 0) {
    return (
      <div className="canvas-focus-tasks">
        <p className="canvas-focus-tasks-empty">No focus tasks for today</p>
      </div>
    );
  }

  return (
    <div className="canvas-focus-tasks">
      <p className="canvas-focus-tasks-heading">Today</p>
      <ul className="canvas-focus-tasks-list">
        {tasks.map((task) => {
          const estimate = formatCanvasFocusTaskEstimate(task.estimateMinutes);

          return (
            <li key={task.id} className="canvas-focus-tasks-item">
              <div className="canvas-focus-tasks-copy">
                <span className="canvas-focus-tasks-title">{task.title}</span>
                {estimate ? (
                  <span className="canvas-focus-tasks-estimate">{estimate}</span>
                ) : null}
              </div>
              <div className="canvas-focus-tasks-actions">
                <button
                  type="button"
                  className="canvas-focus-tasks-action"
                  onClick={() => handleStartFocus(task.id)}
                >
                  Start focus
                </button>
                <button
                  type="button"
                  className="canvas-focus-tasks-action"
                  disabled={!canStartFocusCountdown(task)}
                  title={
                    canStartFocusCountdown(task)
                      ? "Start countdown"
                      : "Add an estimate to start countdown"
                  }
                  onClick={() => {
                    updateInternalTools(
                      startCountdownFromEstimate(workspace.internalTools, task.id, new Date()),
                    );
                    pinInternalToolZone("pomodoro", getLatestShellZones());
                  }}
                >
                  Start countdown
                </button>
                <button
                  type="button"
                  className="canvas-focus-tasks-action"
                  onClick={() =>
                    updateInternalTools(completeFocusTask(workspace.internalTools, task.id))
                  }
                >
                  Done
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
