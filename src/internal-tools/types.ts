import type { FractionalOrderKey } from "@/fractional-order/fractional-order";

export type InternalToolId = "pomodoro" | "tasks";

export const INTERNAL_TOOL_IDS: InternalToolId[] = ["pomodoro", "tasks"];

export function internalToolZoneId(toolId: InternalToolId): string {
  return `__tool_${toolId}__`;
}

export type PomodoroPhase = "work" | "shortBreak" | "longBreak";

export type FocusSplit = {
  id: string;
  label: string;
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
};

export type PomodoroState = {
  splitId: string;
  phase: PomodoroPhase;
  running: boolean;
  endsAt: string | null;
  chimeEnabled: boolean;
  activeTaskId: string | null;
  completedWorkSessions: number;
};

export type FocusTask = {
  id: string;
  title: string;
  estimateMinutes?: number;
  today: boolean;
  completed: boolean;
  orderKey: FractionalOrderKey;
};

export type WorkspaceInternalTools = {
  pomodoro: PomodoroState;
  tasks: FocusTask[];
  customFocusSplit: FocusSplit | null;
};
