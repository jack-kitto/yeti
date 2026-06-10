# Focus countdown shares the pomodoro timer slot

Status: Accepted

Yeti's pomodoro **internal tool** runs work/break cycles from a **focus split**. Users also want a single-interval **focus countdown** from a task's estimate — no phase cycling.

We store timer mode on the existing per-workspace pomodoro record (`mode: "pomodoro" | "countdown"`). One active timer slot per workspace; starting either mode replaces the other. Countdown duration comes from a **focus task** estimate or manual entry; pomodoro mode keeps phases, splits, and chime behavior. Snapshot export/import round-trips the mode field with other pomodoro state.

Considered a separate countdown record on `WorkspaceInternalTools` (two slots — confusing UX and double persistence) and reusing pomodoro phases with break-skipping hacks (blurs product language). Rejected in favor of a explicit mode on the single timer slot already modeled in ADR 0003.
