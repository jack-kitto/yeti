import { describe, expect, it } from "vitest";
import {
  formatTimerSeconds,
  getFocusSplit,
  pausePomodoro,
  remainingSeconds,
  resetPomodoro,
  startPomodoro,
} from "./pomodoro";
import { createDefaultPomodoroState } from "./pomodoro";

describe("startPomodoro", () => {
  it("sets endsAt from the active split work interval", () => {
    const now = new Date("2026-06-09T12:00:00.000Z");
    const started = startPomodoro(createDefaultPomodoroState(), now);

    expect(started.running).toBe(true);
    expect(started.endsAt).toBe("2026-06-09T12:25:00.000Z");
  });
});

describe("pausePomodoro", () => {
  it("stops a running timer without preserving endsAt", () => {
    const paused = pausePomodoro({
      ...createDefaultPomodoroState(),
      running: true,
      endsAt: "2026-06-09T12:25:00.000Z",
    });

    expect(paused.running).toBe(false);
    expect(paused.endsAt).toBeNull();
  });
});

describe("resetPomodoro", () => {
  it("returns to a fresh work phase while keeping split preferences", () => {
    const reset = resetPomodoro({
      ...createDefaultPomodoroState(),
      splitId: "short",
      running: true,
      phase: "shortBreak",
      endsAt: "2026-06-09T12:25:00.000Z",
      chimeEnabled: true,
    });

    expect(reset).toMatchObject({
      splitId: "short",
      phase: "work",
      running: false,
      endsAt: null,
      chimeEnabled: true,
    });
  });
});

describe("remainingSeconds", () => {
  it("counts down toward zero from endsAt", () => {
    const state = startPomodoro(createDefaultPomodoroState(), new Date("2026-06-09T12:00:00.000Z"));

    expect(remainingSeconds(state, new Date("2026-06-09T12:10:00.000Z"))).toBe(900);
    expect(remainingSeconds(state, new Date("2026-06-09T12:30:00.000Z"))).toBe(0);
  });
});

describe("formatTimerSeconds", () => {
  it("renders mm:ss for the flyout display", () => {
    expect(formatTimerSeconds(125)).toBe("2:05");
  });
});

describe("getFocusSplit", () => {
  it("falls back to the classic split for unknown ids", () => {
    expect(getFocusSplit("missing").id).toBe("classic");
  });
});
