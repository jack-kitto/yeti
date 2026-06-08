"use client";

import { useResetLibrary } from "@/hooks/use-library";

export function ShellConfigLibrary() {
  const resetLibrary = useResetLibrary();

  function handleReset() {
    const confirmed = window.confirm(
      "Reset the library to the starter template? This wipes your local library and cannot be undone without a snapshot backup.",
    );
    if (!confirmed) {
      return;
    }

    resetLibrary.mutate();
  }

  return (
    <div className="shell-config-dialog-section">
      <p className="shell-config-dialog-copy">
        Restore the opinionated starter template. Your current library is replaced
        with fresh Work and Personal workspaces, sample links, and default placements.
      </p>
      <button type="button" className="shell-config-reset" onClick={handleReset}>
        Reset to starter template
      </button>
    </div>
  );
}
