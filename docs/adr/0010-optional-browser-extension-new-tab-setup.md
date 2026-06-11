# Optional browser extension for new-tab setup only

Status: Accepted

Yeti ships a minimal Chrome/Firefox extension whose sole job is onboarding: set the browser new-tab URL to the hosted or local **start page** (`/start`), optionally focus page content after load so the **command bar** accepts keystrokes without clicking away from the omnibox, and document one-click install. The extension does not sync **library** data, inject scripts into arbitrary pages, or replace the web app.

The core product remains a web app with no extension required (ADR 0001). Browsers focus the address bar on Ctrl+T by default when the new-tab page is a custom URL; no in-page JavaScript can override that reliably. Keyboard-first **start page** workflow therefore needs either an extension or accepting a mouse-first / pin-`/home` workflow.

**Considered:** PWA or `chrome_url_overrides` without extension packaging (rejected — still requires store install for Chrome new-tab override). Redesign **start page** as mouse-only (kept as fallback — see issue 08). Require users to pin `/home` only (rejected — loses lightweight new-tab story from ADR 0004).
