import { describe, expect, it } from "vitest";
import { createDefaultWorkspaceInternalTools } from "./pomodoro";
import { addFocusTask, completeFocusTask, listTodayTasks } from "./tasks";

describe("focus tasks", () => {
  it("adds a today task and lists only open today items", () => {
    let tools = createDefaultWorkspaceInternalTools();
    tools = addFocusTask(tools, "Ship pomodoro", "task-1");

    expect(listTodayTasks(tools)).toMatchObject([{ id: "task-1", title: "Ship pomodoro" }]);
  });

  it("completes a task so it drops out of the today list", () => {
    let tools = addFocusTask(createDefaultWorkspaceInternalTools(), "Ship tasks", "task-1");
    tools = completeFocusTask(tools, "task-1");

    expect(listTodayTasks(tools)).toEqual([]);
  });
});
