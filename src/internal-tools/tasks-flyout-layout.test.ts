import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  TASKS_FLYOUT_FORM_CLASS,
  TASKS_FLYOUT_LIST_SCROLL_CLASS,
} from "./tasks-flyout-layout";

describe("tasks flyout layout", () => {
  const css = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");

  it("scrolls the task list inside a capped region so the add form stays visible", () => {
    const rule = css.match(
      new RegExp(`\\.${TASKS_FLYOUT_LIST_SCROLL_CLASS}\\s*\\{[^}]+\\}`, "s"),
    );
    expect(rule).not.toBeNull();
    expect(rule![0]).toMatch(/max-height/);
    expect(rule![0]).toMatch(/overflow-y:\s*auto/);
  });

  it("keeps the add-task form outside the scroll region", () => {
    expect(TASKS_FLYOUT_LIST_SCROLL_CLASS).not.toBe(TASKS_FLYOUT_FORM_CLASS);
  });
});
