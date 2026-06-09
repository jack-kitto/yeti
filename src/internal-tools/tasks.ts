import { initialKey, insertBetween, sortByKey } from "@/fractional-order/fractional-order";
import { resolveFocusSplit, startPomodoro } from "./pomodoro";
import type { FocusTask, WorkspaceInternalTools } from "./types";

export function listTodayTasks(tools: WorkspaceInternalTools): FocusTask[] {
  return sortByKey(
    tools.tasks.filter((task) => task.today && !task.completed),
    (task) => task.orderKey,
  );
}

export function addFocusTask(
  tools: WorkspaceInternalTools,
  title: string,
  id = crypto.randomUUID(),
): WorkspaceInternalTools {
  const trimmed = title.trim();
  if (!trimmed) {
    return tools;
  }

  const lastTask = tools.tasks.at(-1);
  const orderKey = lastTask ? insertBetween(lastTask.orderKey, null) : initialKey();

  return {
    ...tools,
    tasks: [
      ...tools.tasks,
      {
        id,
        title: trimmed,
        today: true,
        completed: false,
        orderKey,
      },
    ],
  };
}

export function getActiveFocusTask(tools: WorkspaceInternalTools): FocusTask | null {
  const activeTaskId = tools.pomodoro.activeTaskId;
  if (!activeTaskId) {
    return null;
  }

  return tools.tasks.find((task) => task.id === activeTaskId && !task.completed) ?? null;
}

export function startFocusOnTask(
  tools: WorkspaceInternalTools,
  taskId: string,
  now: Date,
): WorkspaceInternalTools {
  const task = tools.tasks.find((item) => item.id === taskId && !item.completed);
  if (!task) {
    return tools;
  }

  const split = resolveFocusSplit(tools.pomodoro.splitId, tools);

  return {
    ...tools,
    pomodoro: startPomodoro(
      {
        ...tools.pomodoro,
        activeTaskId: taskId,
        phase: "work",
        running: false,
        endsAt: null,
      },
      now,
      split,
    ),
  };
}

export function completeFocusTask(
  tools: WorkspaceInternalTools,
  taskId: string,
): WorkspaceInternalTools {
  return {
    ...tools,
    tasks: tools.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: true } : task,
    ),
  };
}
