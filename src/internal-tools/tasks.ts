import { initialKey, insertBetween, sortByKey } from "@/fractional-order/fractional-order";
import { resolveFocusSplit, startPomodoro } from "./pomodoro";
import type { FocusTask, WorkspaceInternalTools } from "./types";

export function listTodayTasks(tools: WorkspaceInternalTools): FocusTask[] {
  return listOpenTasks(tools, true);
}

export function listBacklogTasks(tools: WorkspaceInternalTools): FocusTask[] {
  return listOpenTasks(tools, false);
}

function listOpenTasks(tools: WorkspaceInternalTools, today: boolean): FocusTask[] {
  return sortByKey(
    tools.tasks.filter((task) => task.today === today && !task.completed),
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

export function moveFocusTask(
  tools: WorkspaceInternalTools,
  taskId: string,
  targetSlotIndex: number,
): WorkspaceInternalTools {
  const task = tools.tasks.find((item) => item.id === taskId && !item.completed);
  if (!task) {
    return tools;
  }

  const sorted = listOpenTasks(tools, task.today);
  const fromIndex = sorted.findIndex((item) => item.id === taskId);
  if (fromIndex === -1) {
    return tools;
  }

  const targetIndex = Math.max(0, Math.min(targetSlotIndex, sorted.length - 1));
  if (fromIndex === targetIndex) {
    return tools;
  }

  const reordered = [...sorted];
  const [moved] = reordered.splice(fromIndex, 1);
  reordered.splice(targetIndex, 0, moved);

  const beforeKey = targetIndex === 0 ? null : reordered[targetIndex - 1].orderKey;
  const afterKey =
    targetIndex === reordered.length - 1 ? null : reordered[targetIndex + 1].orderKey;
  const newOrderKey = insertBetween(beforeKey, afterKey);

  return {
    ...tools,
    tasks: tools.tasks.map((item) =>
      item.id === taskId ? { ...item, orderKey: newOrderKey } : item,
    ),
  };
}

export function setFocusTaskToday(
  tools: WorkspaceInternalTools,
  taskId: string,
  today: boolean,
): WorkspaceInternalTools {
  const task = tools.tasks.find((item) => item.id === taskId && !item.completed);
  if (!task || task.today === today) {
    return tools;
  }

  return {
    ...tools,
    tasks: tools.tasks.map((item) => (item.id === taskId ? { ...item, today } : item)),
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
