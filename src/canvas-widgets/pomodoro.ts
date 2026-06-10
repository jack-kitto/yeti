import { displayPomodoroSeconds, resolveFocusSplit } from "@/internal-tools/pomodoro";
import type { PomodoroState, WorkspaceInternalTools } from "@/internal-tools/types";

export function canvasPomodoroFillLevel(
  pomodoro: PomodoroState,
  tools: Pick<WorkspaceInternalTools, "customFocusSplit">,
  now: Date,
): number {
  const split = resolveFocusSplit(pomodoro.splitId, tools);
  const idle = { ...pomodoro, running: false, endsAt: null };
  const phaseSeconds = displayPomodoroSeconds(idle, split, now);

  if (phaseSeconds <= 0) {
    return 0;
  }

  const remaining = displayPomodoroSeconds(pomodoro, split, now);
  return Math.max(0, Math.min(1, remaining / phaseSeconds));
}
