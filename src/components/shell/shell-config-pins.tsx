"use client";

import { useMemo, useState } from "react";
import { useMutateLibrary } from "@/hooks/use-library";
import { resolveLinkTitle } from "@/link-display/link-display";
import type { Library } from "@/library/types";
import { addPinToStrip, removePinFromStrip } from "@/placement/placement-mutations";
import { resolvePins } from "@/placement/placement";

type ShellConfigPinsProps = {
  library: Library;
};

export function ShellConfigPins({ library }: ShellConfigPinsProps) {
  const mutateLibrary = useMutateLibrary();
  const workspaceId = library.activeWorkspaceId;
  const [pinToAdd, setPinToAdd] = useState("");
  const pins = useMemo(() => resolvePins(library), [library]);
  const pinnedIds = new Set(pins.map((link) => link.id));

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
    <div className="shell-config-dialog-section">
      <p className="shell-config-dialog-copy">
        Pinned links appear on the canvas pin strip for this workspace.
      </p>

      <div className="shell-config-dialog-scroll">
        <ul className="shell-config-catalog">
          {pins.map((link) => (
            <li key={link.id} className="shell-config-catalog-item">
              <div className="shell-config-catalog-copy">
                <span className="shell-config-catalog-title">{resolveLinkTitle(link)}</span>
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
      </div>

      <form className="shell-config-form" onSubmit={handleAddPin}>
        <select
          value={pinToAdd}
          onChange={(event) => setPinToAdd(event.target.value)}
          className="shell-config-input"
        >
          <option value="">Choose a catalog link…</option>
          {catalogOptions
            .filter((link) => !pinnedIds.has(link.id))
            .map((link) => (
              <option key={link.id} value={link.id}>
                {resolveLinkTitle(link)}
              </option>
            ))}
        </select>
        <button type="submit" className="shell-config-submit" disabled={!pinToAdd}>
          Pin to canvas
        </button>
      </form>
    </div>
  );
}
