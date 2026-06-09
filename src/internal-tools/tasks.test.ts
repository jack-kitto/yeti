import { describe, expect, it } from "vitest";
import { createDefaultWorkspaceInternalTools } from "./pomodoro";
import {
  addFocusTask,
  completeFocusTask,
  listBacklogTasks,
  listTodayTasks,
  moveFocusTask,
  setFocusTaskEstimate,
  setFocusTaskToday,
  startFocusOnTask,
} from "./tasks";

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

  it("moves a task off today while keeping it in the backlog", () => {
    const tools = addFocusTask(createDefaultWorkspaceInternalTools(), "Ship tasks", "task-1");

    const updated = setFocusTaskToday(tools, "task-1", false);

    expect(listTodayTasks(updated)).toEqual([]);
    expect(listBacklogTasks(updated)).toMatchObject([{ id: "task-1", title: "Ship tasks" }]);
    expect(listTodayTasks(tools)).toHaveLength(1);
  });

  it("reorders tasks within the today list by slot index", () => {
    let tools = createDefaultWorkspaceInternalTools();
    tools = addFocusTask(tools, "First", "task-1");
    tools = addFocusTask(tools, "Second", "task-2");

    tools = moveFocusTask(tools, "task-2", 0);

    expect(listTodayTasks(tools).map((task) => task.id)).toEqual(["task-2", "task-1"]);
  });

  it("persists optional minute estimates on add and edit", () => {
    let tools = addFocusTask(createDefaultWorkspaceInternalTools(), "Ship tasks", "task-1", 30);

    expect(listTodayTasks(tools)[0]?.estimateMinutes).toBe(30);

    tools = setFocusTaskEstimate(tools, "task-1", 45);

    expect(listTodayTasks(tools)[0]?.estimateMinutes).toBe(45);
  });

  it("sets the active task and starts a work pomodoro", () => {
    const tools = addFocusTask(createDefaultWorkspaceInternalTools(), "Ship tasks", "task-1");
    const now = new Date("2026-06-09T12:00:00.000Z");

    const updated = startFocusOnTask(tools, "task-1", now);

    expect(updated.pomodoro).toMatchObject({
      activeTaskId: "task-1",
      phase: "work",
      running: true,
      endsAt: "2026-06-09T12:25:00.000Z",
    });
  });
});
