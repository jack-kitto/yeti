import {
  displayPomodoroSeconds,
  resolveFocusSplit,
} from "@/internal-tools/pomodoro";
import type { PomodoroState, WorkspaceInternalTools } from "@/internal-tools/types";

export function canvasPomodoroFillLevel(
  pomodoro: PomodoroState,
  tools: Pick<WorkspaceInternalTools, "customFocusSplit">,
  now: Date,
): number {
  const split = resolveFocusSplit(pomodoro.splitId, tools);
  const phaseSeconds = displayPomodoroSeconds(
    { ...pomodoro, running: false, endsAt: null },
    split,
    now,
  );

  if (phaseSeconds <= 0) {
    return 0;
  }

  const remaining = displayPomodoroSeconds(pomodoro, split, now);
  return Math.max(0, Math.min(1, remaining / phaseSeconds));
}
