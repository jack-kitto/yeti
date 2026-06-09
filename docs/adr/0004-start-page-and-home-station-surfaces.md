# Start page and home station as separate surfaces

Status: Accepted

Yeti serves two product surfaces, not one app with an SSR bootstrap phase. The **home station** (`/home`) is the full **shell** backed by IndexedDB **library** data — rims, canvas, tools, settings. Pin it and keep it open as the all-day tab. The **start page** (`/start`) is a lightweight new-tab surface: **command bar** search over the full **link catalog** with the active **workspace** **theme** as backdrop — no **shell** chrome. Both surfaces read the same **library** from IndexedDB; there is no URL-encoded theme or link payload. `/` is a minimal **landing page**.

Open `/home` once so the library seeds; bookmark `/start` as the browser new-tab URL. First visit to either surface may show a loading gate; subsequent new tabs to `/start` resolve the library from local IndexedDB quickly without loading the full shell JS bundle.

We rejected (1) a single-route SSR-bootstrap-then-merge model — merge/flash complexity for little gain once IDB is local; (2) opaque URL payloads encoding catalog links — URL length limits, stale bookmarks, and regeneration friction when the catalog changes. Cross-machine restore stays on **library snapshot** import, not start-page URLs.

Considered server-fetched snapshot URLs for cold-start bootstrap; rejected for v1 — adds latency and failure modes; local-first seed on first `/home` visit is sufficient.
