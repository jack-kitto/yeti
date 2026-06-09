import type {
  FocusSplit,
  PomodoroPhase,
  PomodoroState,
  WorkspaceInternalTools,
} from "./types";

export const DEFAULT_SPLIT_ID = "classic";
export const CUSTOM_SPLIT_ID = "custom";

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
  {
    id: "deep",
    label: "Deep focus",
    workMinutes: 50,
    shortBreakMinutes: 10,
    longBreakMinutes: 20,
  },
];

export function resolveFocusSplit(
  splitId: string,
  tools?: Pick<WorkspaceInternalTools, "customFocusSplit">,
): FocusSplit {
  if (splitId === CUSTOM_SPLIT_ID && tools?.customFocusSplit) {
    return tools.customFocusSplit;
  }

  return BUILTIN_FOCUS_SPLITS.find((split) => split.id === splitId) ?? BUILTIN_FOCUS_SPLITS[0];
}

export function getFocusSplit(splitId: string): FocusSplit {
  return resolveFocusSplit(splitId);
}

export function createDefaultPomodoroState(): PomodoroState {
  return {
    splitId: DEFAULT_SPLIT_ID,
    phase: "work",
    running: false,
    endsAt: null,
    chimeEnabled: false,
    activeTaskId: null,
    completedWorkSessions: 0,
  };
}

export function createDefaultWorkspaceInternalTools(): WorkspaceInternalTools {
  return {
    pomodoro: createDefaultPomodoroState(),
    tasks: [],
    customFocusSplit: null,
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
    activeTaskId: state.activeTaskId,
  };
}

const WORK_SESSIONS_BEFORE_LONG_BREAK = 4;

export function advancePomodoroPhase(state: PomodoroState): PomodoroState {
  if (state.phase === "work") {
    const completedWorkSessions = state.completedWorkSessions + 1;
    const nextPhase: PomodoroPhase =
      completedWorkSessions % WORK_SESSIONS_BEFORE_LONG_BREAK === 0
        ? "longBreak"
        : "shortBreak";

    return {
      ...state,
      phase: nextPhase,
      running: false,
      endsAt: null,
      completedWorkSessions,
    };
  }

  return {
    ...state,
    phase: "work",
    running: false,
    endsAt: null,
  };
}

export function isPomodoroPhaseComplete(state: PomodoroState, now: Date): boolean {
  return state.running && remainingSeconds(state, now) === 0;
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
