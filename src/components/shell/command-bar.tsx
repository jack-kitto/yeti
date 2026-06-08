"use client";

import { useMemo, useState } from "react";
import { resolveLinkTitle } from "@/link-display/link-display";
import type { Library } from "@/library/types";
import { searchLinks, searchWorkspaces } from "@/search/search";

type CommandBarProps = {
  library: Library;
  onSwitchWorkspace: (workspaceId: string) => void;
};

export function CommandBar({ library, onSwitchWorkspace }: CommandBarProps) {
  const [query, setQuery] = useState("");

  const workspaceResults = useMemo(
    () => searchWorkspaces(library, query),
    [library, query],
  );
  const linkResults = useMemo(() => searchLinks(library, query), [library, query]);

  const trimmedQuery = query.trim();
  const showResults =
    trimmedQuery.length > 0 &&
    (workspaceResults.length > 0 || linkResults.length > 0);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search links…"
        aria-label="Command bar"
        aria-expanded={showResults}
        aria-controls="command-bar-results"
        className="w-full rounded-[var(--qs-border-radius)] border border-white/20 bg-[color:var(--qs-color-surface)]/80 px-4 py-2.5 text-sm text-[color:var(--qs-color-text)] shadow-sm backdrop-blur-sm outline-none ring-[color:var(--qs-color-accent)] focus:ring-2"
      />

      {showResults ? (
        <ul
          id="command-bar-results"
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-[var(--qs-border-radius)] border border-white/20 bg-[color:var(--qs-color-surface)]/95 p-1 shadow-lg backdrop-blur-md"
        >
          {workspaceResults.map((workspace) => (
            <li key={workspace.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-[var(--qs-border-radius)] px-3 py-2 text-left text-sm hover:bg-black/5"
                onClick={() => {
                  onSwitchWorkspace(workspace.id);
                  setQuery("");
                }}
              >
                <span>Switch to {workspace.name}</span>
                <span className="text-xs opacity-60">workspace</span>
              </button>
            </li>
          ))}
          {linkResults.map(({ link, source }) => (
            <li key={link.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-[var(--qs-border-radius)] px-3 py-2 text-left text-sm hover:bg-black/5"
                onClick={() => {
                  window.open(link.url, "_blank", "noopener,noreferrer");
                  setQuery("");
                }}
              >
                <span>{resolveLinkTitle(link)}</span>
                <span className="text-xs opacity-60">
                  {source === "workspace" ? "placed" : "catalog"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
