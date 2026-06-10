import { describe, expect, it } from "vitest";
import { createDefaultPomodoroState, startPomodoro } from "@/internal-tools/pomodoro";
import { canvasPomodoroFillLevel } from "./pomodoro";

describe("canvasPomodoroFillLevel", () => {
  it("starts full when idle on the current phase", () => {
    const tools = { customFocusSplit: null };

    expect(
      canvasPomodoroFillLevel(createDefaultPomodoroState(), tools, new Date("2026-06-09T12:00:00.000Z")),
    ).toBe(1);
  });

  it("drains toward empty as the timer runs", () => {
    const tools = { customFocusSplit: null };
    const running = startPomodoro(createDefaultPomodoroState(), new Date("2026-06-09T12:00:00.000Z"));

    expect(
      canvasPomodoroFillLevel(running, tools, new Date("2026-06-09T12:12:30.000Z")),
    ).toBeCloseTo(0.5, 2);
  });
});
