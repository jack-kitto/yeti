# Internal tools as first-class library records

Status: Accepted

Yeti's right rim hosts built-in apps (pomodoro, focus tasks) with the same handle/flyout UX as left-rim link edge groups. Reusing **edge groups** or catalog **links** would force tool state (timer `endsAt`, task backlog, today flags, time estimates) through a link-placement model built for URLs.

We model **internal tools** as first-class records in the **library** aggregate — sibling to link placements, not edge-group reuse. Tool state is **per-workspace**, persisted in IndexedDB and included in **library snapshot** YAML export/import. Focus tasks use **fractional order**; pomodoro uses **focus splits** (preset + custom). Light coupling: **Start focus** on a task sets the active task and starts a work-interval timer.

Considered edge-group reuse and a separate IndexedDB store for tool state; rejected because link shapes leak into snapshots/settings and a second store breaks snapshot portability.
