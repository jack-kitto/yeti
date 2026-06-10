import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  POMODORO_FLYOUT_PHASE_CLASS,
  POMODORO_FLYOUT_SPLIT_SUMMARY_CLASS,
  POMODORO_FLYOUT_STATUS_CLASS,
} from "./pomodoro-flyout-display";

describe("pomodoro flyout display", () => {
  const css = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");

  it("groups phase, timer, and split summary in a vertical status block", () => {
    const statusRule = css.match(
      new RegExp(`\\.${POMODORO_FLYOUT_STATUS_CLASS}\\s*\\{[^}]+\\}`, "s"),
    );
    expect(statusRule).not.toBeNull();
    expect(statusRule![0]).toMatch(/flex-direction:\s*column/);

    expect(css).toMatch(new RegExp(`\\.${POMODORO_FLYOUT_PHASE_CLASS}\\s*\\{`));
    expect(css).toMatch(new RegExp(`\\.${POMODORO_FLYOUT_SPLIT_SUMMARY_CLASS}\\s*\\{`));
  });
});
