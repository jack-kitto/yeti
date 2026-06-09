"use client";

import { useConfigStore } from "@/store/config-store";
import { getShellLayout } from "@/shell-frame/layout";

export function ShellSettingsButton() {
  const openSettings = useConfigStore((state) => state.openSettings);
  const layout = getShellLayout();

  return (
    <button
      type="button"
      className="shell-icon-btn shell-settings-btn"
      style={{
        left: layout.frameLeft * 0.5,
        top: layout.panelBottom - layout.sidePadding * 0.45,
      }}
      aria-label="Settings"
      onClick={() => openSettings()}
    >
      <span className="shell-icon-glyph" aria-hidden>
        ⚙
      </span>
    </button>
  );
}
