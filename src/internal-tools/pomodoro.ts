import type {
  FocusSplit,
  PomodoroPhase,
  PomodoroState,
  WorkspaceInternalTools,
} from "./types";

export const DEFAULT_SPLIT_ID = "classic";

export const BUILTIN_FOCUS_SPLITS: FocusSplit[] = [
  {
    id: "classic",
    label: "Classic",
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
  },
  {
    id: "short",
    label: "Short",
    workMinutes: 15,
    shortBreakMinutes: 3,
    longBreakMinutes: 10,
  },
];

export function getFocusSplit(splitId: string): FocusSplit {
  return (
    BUILTIN_FOCUS_SPLITS.find((split) => split.id === splitId) ?? BUILTIN_FOCUS_SPLITS[0]
  );
}

export function createDefaultPomodoroState(): PomodoroState {
  return {
    splitId: DEFAULT_SPLIT_ID,
    phase: "work",
    running: false,
    endsAt: null,
    chimeEnabled: false,
    activeTaskId: null,
  };
}

export function createDefaultWorkspaceInternalTools(): WorkspaceInternalTools {
  return {
    pomodoro: createDefaultPomodoroState(),
    tasks: [],
  };
}

function phaseMinutes(phase: PomodoroPhase, split: FocusSplit): number {
  if (phase === "work") {
    return split.workMinutes;
  }
  if (phase === "shortBreak") {
    return split.shortBreakMinutes;
  }
  return split.longBreakMinutes;
}

export function startPomodoro(
  state: PomodoroState,
  now: Date,
  split: FocusSplit = getFocusSplit(state.splitId),
): PomodoroState {
  const minutes = phaseMinutes(state.phase, split);
  return {
    ...state,
    running: true,
    endsAt: new Date(now.getTime() + minutes * 60_000).toISOString(),
  };
}

export function pausePomodoro(state: PomodoroState): PomodoroState {
  return {
    ...state,
    running: false,
    endsAt: null,
  };
}

export function resetPomodoro(state: PomodoroState): PomodoroState {
  return {
    ...createDefaultPomodoroState(),
    splitId: state.splitId,
    chimeEnabled: state.chimeEnabled,
  };
}

export function remainingSeconds(state: PomodoroState, now: Date): number {
  if (!state.running || !state.endsAt) {
    return 0;
  }

  const endsAtMs = new Date(state.endsAt).getTime();
  return Math.max(0, Math.ceil((endsAtMs - now.getTime()) / 1000));
}

export function formatTimerSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
