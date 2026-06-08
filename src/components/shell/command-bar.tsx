"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildCommandBarRows,
  initialCommandBarSelection,
  moveCommandBarSelection,
  shortcutMatchesEvent,
  type CommandBarResult,
} from "@/command-bar/command-bar";
import { useResetLibrary } from "@/hooks/use-library";
import type { Library } from "@/library/types";

type CommandBarProps = {
  library: Library;
  onSwitchWorkspace: (workspaceId: string) => void;
};

function resultKey(result: CommandBarResult): string {
  if (result.kind === "workspace") {
    return result.workspaceId;
  }
  if (result.kind === "link") {
    return result.linkId;
  }
  return result.actionId;
}

export function CommandBar({ library, onSwitchWorkspace }: CommandBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const resetLibraryMutation = useResetLibrary();

  const results = useMemo(
    () => buildCommandBarRows(library, query),
    [library, query],
  );

  const trimmedQuery = query.trim();
  const showResults = trimmedQuery.length > 0 && results.length > 0;

  useEffect(() => {
    setSelectedIndex(initialCommandBarSelection(results.length));
  }, [results]);

  useEffect(() => {
    function handleFocusShortcut(event: KeyboardEvent) {
      if (!shortcutMatchesEvent(event, library.shortcuts.focusCommandBar)) {
        return;
      }

      event.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    }

    window.addEventListener("keydown", handleFocusShortcut);
    return () => window.removeEventListener("keydown", handleFocusShortcut);
  }, [library.shortcuts.focusCommandBar]);

  function executeResult(result: CommandBarResult) {
    if (result.kind === "workspace") {
      onSwitchWorkspace(result.workspaceId);
      setQuery("");
      return;
    }

    if (result.kind === "action") {
      if (result.actionId === "reset") {
        const confirmed = window.confirm(
          "Reset the library to the starter template? This wipes your local library and cannot be undone without a snapshot backup.",
        );
        if (confirmed) {
          resetLibraryMutation.mutate();
          setQuery("");
        }
      }
      return;
    }

    window.open(result.url, "_blank", "noopener,noreferrer");
    setQuery("");
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      if (trimmedQuery.length > 0) {
        setQuery("");
        return;
      }
      event.currentTarget.blur();
      return;
    }

    if (!showResults) {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "j") {
      event.preventDefault();
      setSelectedIndex((current) =>
        moveCommandBarSelection(current, "down", results.length),
      );
      return;
    }

    if (event.key === "ArrowUp" || event.key === "k") {
      event.preventDefault();
      setSelectedIndex((current) =>
        moveCommandBarSelection(current, "up", results.length),
      );
      return;
    }

    if (event.key === "Enter" && selectedIndex >= 0) {
      event.preventDefault();
      const result = results[selectedIndex];
      if (result) {
        executeResult(result);
      }
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleInputKeyDown}
        placeholder="Search links… (: for actions)"
        aria-label="Command bar"
        aria-expanded={showResults}
        aria-controls="command-bar-results"
        aria-activedescendant={
          showResults && selectedIndex >= 0
            ? `command-bar-result-${resultKey(results[selectedIndex])}`
            : undefined
        }
        role="combobox"
        aria-autocomplete="list"
        className="w-full rounded-[var(--qs-border-radius)] border border-white/20 bg-[color:var(--qs-color-surface)]/80 px-4 py-2.5 text-sm text-[color:var(--qs-color-text)] shadow-sm backdrop-blur-sm outline-none ring-[color:var(--qs-color-accent)] focus:ring-2"
      />

      {showResults ? (
        <ul
          id="command-bar-results"
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-[var(--qs-border-radius)] border border-white/20 bg-[color:var(--qs-color-surface)]/95 p-1 shadow-lg backdrop-blur-md"
        >
          {results.map((result, index) => {
            const selected = index === selectedIndex;
            const id = `command-bar-result-${resultKey(result)}`;

            if (result.kind === "workspace") {
              return (
                <li key={result.workspaceId} id={id} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between rounded-[var(--qs-border-radius)] px-3 py-2 text-left text-sm ${
                      selected
                        ? "bg-[color:var(--qs-color-accent)]/15 ring-1 ring-[color:var(--qs-color-accent)]/40"
                        : "hover:bg-black/5"
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => executeResult(result)}
                  >
                    <span>Switch to {result.name}</span>
                    <span className="text-xs opacity-60">workspace</span>
                  </button>
                </li>
              );
            }

            if (result.kind === "action") {
              return (
                <li key={result.actionId} id={id} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between rounded-[var(--qs-border-radius)] px-3 py-2 text-left text-sm ${
                      selected
                        ? "bg-[color:var(--qs-color-accent)]/15 ring-1 ring-[color:var(--qs-color-accent)]/40"
                        : "hover:bg-black/5"
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => executeResult(result)}
                  >
                    <span>{result.label}</span>
                    <span className="text-xs opacity-60">action</span>
                  </button>
                </li>
              );
            }

            return (
              <li key={result.linkId} id={id} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`flex w-full items-center justify-between rounded-[var(--qs-border-radius)] px-3 py-2 text-left text-sm ${
                    selected
                      ? "bg-[color:var(--qs-color-accent)]/15 ring-1 ring-[color:var(--qs-color-accent)]/40"
                      : "hover:bg-black/5"
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => executeResult(result)}
                >
                  <span>{result.title}</span>
                  <span className="text-xs opacity-60">
                    {result.source === "workspace" ? "placed" : "catalog"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
