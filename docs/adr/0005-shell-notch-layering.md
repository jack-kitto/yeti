# Shell notch layering over the canvas

Status: Accepted

The **shell** paints **on top of** the **canvas**, not as a hole punched inward from a canvas bubble. On rim hover the shell expands outward into a **notch** (iPhone-bezel style). The notch surface **is** the menu container; **rim menu** content sits above the notch with no enclosing flyout card. **Edge handles** are shell chrome — below open rim menus. **Launcher** and **settings** stay on the top plane above everything.

Paint order (bottom → top):

1. **Canvas** — theme backdrop and **canvas widgets**
2. **Shell** — canvas-drawn glass rim and notch deformation; DOM handles and rim hit targets
3. **Rim menu** — bare content (edge link lists flat; denser UIs may use row-level chrome only)
4. **Top plane** — **launcher**, **settings**

Where a notch overlaps the canvas, **canvas widgets** are fully occluded in that region only — no global dim when a notch opens. Rim menu content reveals in lockstep with notch expansion (one motion).

We rejected (1) the issue-25 mental model of an inward canvas pocket with menu content under the canvas plane — menus were unreadable and fought the glass frame; (2) flyout wrapper cards with their own glass/backdrop — double-framing against the notch; (3) shell frame below canvas widgets — clock and quote bled through or competed with open pockets.

Implementation: DOM/`z-index` enforces the stack (`canvas` → `ShellCanvas` → shell chrome → rim menus → modals). Pocket geometry math in `src/shell-frame/` is unchanged; only stacking and flyout surface styling change.
