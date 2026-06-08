"use client";

import { useMemo, useState } from "react";
import { useMutateLibrary } from "@/hooks/use-library";
import { resolveLinkTitle } from "@/link-display/link-display";
import type { Library } from "@/library/types";
import { addPinToStrip, removePinFromStrip } from "@/placement/placement-mutations";
import { resolvePins } from "@/placement/placement";
import { ShellConfigLinkPicker } from "./shell-config-link-picker";

type ShellConfigPinsProps = {
  library: Library;
};

export function ShellConfigPins({ library }: ShellConfigPinsProps) {
  const mutateLibrary = useMutateLibrary();
  const workspaceId = library.activeWorkspaceId;
  const [pinToAdd, setPinToAdd] = useState("");
  const pins = useMemo(() => resolvePins(library), [library]);
  const pinnedIds = useMemo(() => new Set(pins.map((link) => link.id)), [pins]);

  const catalogOptions = useMemo(
    () =>
      [...library.catalog].sort((left, right) =>
        resolveLinkTitle(left).localeCompare(resolveLinkTitle(right)),
      ),
    [library.catalog],
  );

  function handleAddPin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pinToAdd) {
      return;
    }
    mutateLibrary.mutate((current) => addPinToStrip(current, workspaceId, pinToAdd));
    setPinToAdd("");
  }

  function handleRemovePin(linkId: string) {
    mutateLibrary.mutate((current) => removePinFromStrip(current, workspaceId, linkId));
  }

  return (
    <div className="shell-config-dialog-section shell-config-dialog-section-fill">
      <p className="shell-config-dialog-copy">
        Pinned links appear on the canvas pin strip for this workspace.
      </p>

      <div className="shell-config-split">
        <div className="shell-config-split-pane">
          <p className="shell-config-form-label">Pinned ({pins.length})</p>
          <div className="shell-config-dialog-scroll shell-config-dialog-scroll-fill">
            {pins.length === 0 ? (
              <p className="shell-config-empty">No pins yet. Pick a catalog link to add one.</p>
            ) : (
              <ul className="shell-config-catalog">
                {pins.map((link, index) => (
                  <li key={link.id} className="shell-config-catalog-item">
                    <div className="shell-config-catalog-copy">
                      <span className="shell-config-catalog-order tabular-nums">
                        {index + 1}
                      </span>
                      <span className="shell-config-catalog-title">
                        {resolveLinkTitle(link)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="shell-config-action shell-config-action-danger"
                      onClick={() => handleRemovePin(link.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <form
          className="shell-config-split-pane shell-config-form-pane shell-config-form"
          onSubmit={handleAddPin}
        >
          <p className="shell-config-form-label">Pin from catalog</p>
          <ShellConfigLinkPicker
            links={catalogOptions}
            excludeIds={pinnedIds}
            value={pinToAdd}
            onChange={setPinToAdd}
            emptyMessage="All catalog links are already pinned."
          />
          <button type="submit" className="shell-config-submit" disabled={!pinToAdd}>
            Pin to canvas
          </button>
        </form>
      </div>
    </div>
  );
}
