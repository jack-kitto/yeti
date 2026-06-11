# YAML-first configuration surface

Status: Accepted

Long-term configuration flows through three surfaces: versioned **library snapshot** YAML (authoritative for structure and bulk edits), **command bar** actions for quick captures (`:add`, `:task`, `:import`, etc.), and the **control center** for glance-and-apply changes (**theme preset**, **layout preset**, workspace switch). The **settings** modal is deprecated and removed once parity exists on those surfaces.

We rejected keeping the large settings dialog as the primary config UI because it duplicates YAML, feels like a traditional web admin panel, and conflicts with the rice/shell aesthetic. We rejected YAML-only with no in-app capture because pasting URLs and tasks from the **command bar** must stay fast for daily use.

Phased removal: add command-bar and control-center parity first; then delete settings sections; keep `:reset` and snapshot import/export reachable without the modal before the dialog is removed entirely.

**Considered:** Keep settings for "power users" indefinitely (rejected — splits mental model). Generate YAML only, never edit in app (rejected — too harsh for focus radio, shortcuts, and one-off link adds).
