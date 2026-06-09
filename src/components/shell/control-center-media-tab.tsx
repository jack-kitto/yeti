"use client";

import { useState } from "react";
import { buildFocusRadioStationPickerRows } from "@/focus-radio/station-picker";
import { updateFocusRadioPlayback } from "@/focus-radio/stations";
import { useMutateLibrary } from "@/hooks/use-library";
import type { Library } from "@/library/types";

type ControlCenterMediaTabProps = {
  library: Library;
};

export function ControlCenterMediaTab({ library }: ControlCenterMediaTabProps) {
  const mutateLibrary = useMutateLibrary();
  const [query, setQuery] = useState("");
  const rows = buildFocusRadioStationPickerRows(library, query);

  function handleSelectStation(stationId: string) {
    mutateLibrary.mutate((current) =>
      updateFocusRadioPlayback(current, { stationId }),
    );
  }

  return (
    <div className="shell-dashboard-media">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search stations"
        aria-label="Filter stations"
        className="shell-dashboard-media-search-input"
      />

      <ul className="shell-dashboard-media-list">
        {rows.map((row) => (
          <li key={row.id}>
            <button
              type="button"
              className={`shell-dashboard-media-row${row.active ? " active" : ""}`}
              onClick={() => handleSelectStation(row.id)}
              aria-current={row.active ? "true" : undefined}
            >
              {row.imageUrl ? (
                <img
                  src={row.imageUrl}
                  alt=""
                  className="shell-dashboard-media-artwork"
                />
              ) : (
                <span className="shell-dashboard-media-artwork shell-dashboard-media-artwork-fallback" aria-hidden>
                  {row.label.slice(0, 1)}
                </span>
              )}
              <span className="shell-dashboard-media-label">{row.label}</span>
              {row.favorite ? (
                <span className="shell-dashboard-media-favorite" aria-label="Favorite">
                  ★
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
