import { describe, expect, it } from "vitest";
import {
  advancePomodoroPhase,
  BUILTIN_FOCUS_SPLITS,
  createDefaultWorkspaceInternalTools,
  formatTimerSeconds,
  getFocusSplit,
  pausePomodoro,
  remainingSeconds,
  resetPomodoro,
  resolveFocusSplit,
  setCustomFocusSplit,
  setPomodoroSplit,
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

describe("BUILTIN_FOCUS_SPLITS", () => {
  it("includes a deep focus preset up to 50 minutes work and 10 minutes break", () => {
    expect(BUILTIN_FOCUS_SPLITS).toContainEqual(
      expect.objectContaining({
        id: "deep",
        workMinutes: 50,
        shortBreakMinutes: 10,
      }),
    );
  });
});

describe("setPomodoroSplit", () => {
  it("persists the selected focus split on the workspace pomodoro state", () => {
    const tools = createDefaultWorkspaceInternalTools();

    const updated = setPomodoroSplit(tools, "deep");

    expect(updated.pomodoro.splitId).toBe("deep");
    expect(tools.pomodoro.splitId).toBe("classic");
  });
});

describe("setCustomFocusSplit", () => {
  it("stores a validated custom split and selects it on the workspace", () => {
    const tools = createDefaultWorkspaceInternalTools();

    const updated = setCustomFocusSplit(tools, {
      label: "My split",
      workMinutes: 40,
      shortBreakMinutes: 8,
      longBreakMinutes: 16,
    });

    expect(updated.customFocusSplit).toEqual({
      id: "custom",
      label: "My split",
      workMinutes: 40,
      shortBreakMinutes: 8,
      longBreakMinutes: 16,
    });
    expect(updated.pomodoro.splitId).toBe("custom");
    expect(tools.customFocusSplit).toBeNull();
  });
});

describe("resolveFocusSplit", () => {
  it("returns a workspace custom split when custom is selected", () => {
    const custom = {
      id: "custom",
      label: "My split",
      workMinutes: 40,
      shortBreakMinutes: 8,
      longBreakMinutes: 16,
    };

    expect(
      resolveFocusSplit("custom", {
        customFocusSplit: custom,
      }),
    ).toEqual(custom);
  });
});

describe("advancePomodoroPhase", () => {
  it("moves from work to short break after a work interval", () => {
    const advanced = advancePomodoroPhase(createDefaultPomodoroState());

    expect(advanced).toMatchObject({
      phase: "shortBreak",
      running: false,
      endsAt: null,
      completedWorkSessions: 1,
    });
  });

  it("uses a long break after four completed work sessions", () => {
    const state = {
      ...createDefaultPomodoroState(),
      completedWorkSessions: 3,
    };

    const advanced = advancePomodoroPhase(state);

    expect(advanced.phase).toBe("longBreak");
    expect(advanced.completedWorkSessions).toBe(4);
  });

  it("returns to work after a break interval", () => {
    const advanced = advancePomodoroPhase({
      ...createDefaultPomodoroState(),
      phase: "shortBreak",
      running: true,
      endsAt: "2026-06-09T12:05:00.000Z",
    });

    expect(advanced).toMatchObject({
      phase: "work",
      running: false,
      endsAt: null,
    });
  });
});
