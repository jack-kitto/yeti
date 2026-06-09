Status: backlog

## Parent

`.scratch/quickshell-v1/PRD.md`

## What to build

**Future exploration:** integrate an external coding agent into the shell — e.g. [Hermes Agent](https://github.com/NousResearch/hermes-agent), OpenClaw, or similar.

**v1:** strictly backlog (locked 2025-06 grill) — no surface until core shell ships.

Scope TBD. Possible directions: command bar action to invoke agent, **internal tool** on the **right rim** (see issue 28), or background task runner. No implementation until product model and privacy/trust boundaries are defined. See grill notes in Comments.

## Acceptance criteria

- [ ] Human picks target integration (Hermes vs OpenClaw vs other) and interaction surface
- [ ] ADR covers auth, API keys, data sent to agent, and what persists in the library
- [ ] Minimal tracer bullet demonstrates end-to-end invoke + response in the shell

## Blocked by

None for research — implementation likely blocked by issue 28 (right-edge tools) or command bar action model

## Comments

Backlog item (2025-06): potential future idea only. Not v1 unless explicitly promoted.

### Grill exploration (2025-06) — value hypotheses

Yeti is shaping into a **minimal dev productivity workstation** (focus tasks + pomodoro + calendar + universal input). An agent fits best as **accelerator for focus**, not a second settings UI.

**High-value feature ideas**

| Idea | What it does | Fits where |
|------|----------------|------------|
| **Ticket → focus task** | Paste issue URL or description; agent returns title + time estimate + "today" suggestion | Command bar or tasks flyout |
| **Day planning** | Merge calendar glance + backlog; propose today's focus list | Control center calendar tab or morning command-bar action |
| **Focus session coach** | During pomodoro: "stuck?", "scope this smaller", break reminders | Right-rim agent tool or pomodoro flyout panel |
| **Post-session capture** | After work interval: one-line log ("shipped X", blockers) appended to task | Tasks flyout |
| **Estimate sanity check** | Challenge estimates against task description before **Start focus** | Tasks flyout |
| **Workspace-aware persona** | Work workspace → professional tone + work links context; Personal → lighter | System prompt per workspace, opt-in context |

**Lower value / avoid**

- Natural-language link CRUD (settings already exists; error-prone)
- Canvas widget agent (canvas is ambient-only now)
- Always-on background agent (battery, privacy, noise)

**Trust boundaries to ADR later**

- Keys: local-only in library vs never stored (user pastes per session)
- Context envelope: active workspace name, active focus task, optional single URL — not whole catalog by default
- Local agent (OpenClaw on machine) vs cloud API — different trust models
- Nothing leaves browser without explicit invoke + visible context preview

**Primary job (locked exploration):** **Both** focus modes — planning (break down tickets, plan day, estimates) **and** in-session coaching — **plus** a general **agent host** for anything the user's agent can do elsewhere.

**General agent interface (beyond focus)**

- **Library ops** — e.g. push **library snapshot** to a GitHub repo, pull remote config on load
- **Reminders / notifications** — schedule nudges tied to focus tasks or calendar (browser Notification API + optional future sync)
- **Skill dispatch** — invoke packaged workflows by name (`grill-with-docs`, `teach-me`, triage, handoff, etc.) with Yeti as the front door
- **Open-ended** — same surface for ad-hoc asks; not limited to productivity workstation flows

**Surface ranking (post-v1)**

1. **Unified agent backend** — one trust/context model; multiple entry points:
   - **Command bar** — quick skill dispatch (`:grill`, `:teach`, `:snapshot push`) and one-shot asks
   - **Right-rim internal tool** — multi-turn conversation; focus planning + in-session coaching; deeper skill runs
2. Focus-specific flows are **skill presets** on that backend, not a separate mini-agent
3. **Control center** — only when agent needs calendar + media context together

**Implication:** Yeti becomes an **agent host surface** — local-first shell UI over the user's agent runtime. ADR must cover keys, outbound data, GitHub write scope, and notification permissions.

**Agent runtime (locked exploration):** **Pluggable adapters** — user picks runtime in settings (local OpenClaw/Hermes, cloud API with user key, etc.). Yeti is UI host only; never Yeti-hosted keys/models by default. Local adapter preferred where possible.
