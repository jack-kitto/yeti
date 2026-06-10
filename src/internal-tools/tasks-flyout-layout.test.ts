import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  TASKS_FLYOUT_ACTIONS_CLASS,
  TASKS_FLYOUT_FORM_CLASS,
  TASKS_FLYOUT_ITEM_CLASS,
  TASKS_FLYOUT_LIST_SCROLL_CLASS,
  TASKS_FLYOUT_MAIN_CLASS,
} from "./tasks-flyout-layout";

describe("tasks flyout layout", () => {
  const css = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");

  it("scrolls the task list inside a capped region so the add form stays visible", () => {
    const rule = css.match(new RegExp(`\\.${TASKS_FLYOUT_LIST_SCROLL_CLASS}\\s*\\{[^}]+\\}`, "s"));
    expect(rule).not.toBeNull();
    expect(rule![0]).toMatch(/max-height/);
    expect(rule![0]).toMatch(/overflow-y:\s*auto/);
  });

  it("keeps the add-task form outside the scroll region", () => {
    expect(TASKS_FLYOUT_LIST_SCROLL_CLASS).not.toBe(TASKS_FLYOUT_FORM_CLASS);
  });

  it("stacks task content and actions vertically so titles do not overlap controls", () => {
    const itemRule = css.match(new RegExp(`\\.${TASKS_FLYOUT_ITEM_CLASS}\\s*\\{[^}]+\\}`, "s"));
    expect(itemRule).not.toBeNull();
    expect(itemRule![0]).toMatch(/flex-direction:\s*column/);
  });

  it("keeps title and estimate on the main row", () => {
    const mainRule = css.match(new RegExp(`\\.${TASKS_FLYOUT_MAIN_CLASS}\\s*\\{[^}]+\\}`, "s"));
    expect(mainRule).not.toBeNull();
    expect(mainRule![0]).toMatch(/flex-direction:\s*row/);
  });

  it("wraps action buttons on their own row below the title", () => {
    const actionsRule = css.match(
      new RegExp(`\\.${TASKS_FLYOUT_ACTIONS_CLASS}\\s*\\{[^}]+\\}`, "s"),
    );
    expect(actionsRule).not.toBeNull();
    expect(actionsRule![0]).toMatch(/flex-wrap:\s*wrap/);
    expect(actionsRule![0]).toMatch(/width:\s*100%/);
  });
});
