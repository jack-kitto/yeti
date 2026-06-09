import { initialKey, insertBetween, sortByKey } from "@/fractional-order/fractional-order";
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
