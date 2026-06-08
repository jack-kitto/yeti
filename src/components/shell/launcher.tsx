"use client";

import { useEffect, useMemo, useState } from "react";
import {
  resolveLinkImageUrl,
  resolveLinkTitle,
} from "@/link-display/link-display";
import type { Library, Link } from "@/library/types";
import {
  resolveEdgeGroupLinks,
  resolveWorkspacePlacedLinks,
} from "@/placement/placement";
import { filterLinks } from "@/search/search";
import { useLauncherStore } from "@/store/launcher-store";

type LauncherProps = {
  library: Library;
};

function LauncherLinkCard({ link }: { link: Link }) {
  const title = resolveLinkTitle(link);
  const imageUrl = resolveLinkImageUrl(link);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-2 rounded-[var(--qs-border-radius)] border border-white/10 bg-[color:var(--qs-color-surface)]/60 p-4 text-center transition hover:border-white/25 hover:bg-[color:var(--qs-color-surface)]/90"
      title={title}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          width={40}
          height={40}
          className="rounded-lg"
        />
      ) : (
        <span className="inline-block h-10 w-10 rounded-lg bg-black/10" />
      )}
      <span className="line-clamp-2 text-sm">{title}</span>
    </a>
  );
}

export function Launcher({ library }: LauncherProps) {
  const { open, edge, showFullCatalog, close, toggleCatalog } =
    useLauncherStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const baseLinks = useMemo(() => {
    if (showFullCatalog) {
      return library.catalog;
    }

    if (edge) {
      return resolveEdgeGroupLinks(library, edge);
    }

    return resolveWorkspacePlacedLinks(library);
  }, [library, edge, showFullCatalog]);

  const visibleLinks = useMemo(
    () => filterLinks(baseLinks, query),
    [baseLinks, query],
  );

  if (!open) {
    return null;
  }

  const scopeLabel = showFullCatalog
    ? "Full catalog"
    : edge
      ? `${edge} edge`
      : "Workspace";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <button
        type="button"
        aria-label="Close launcher"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Launcher"
        className="relative flex max-h-[min(85vh,48rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[var(--qs-border-radius)] border border-white/20 bg-[color:var(--qs-color-surface)]/95 shadow-2xl backdrop-blur-xl"
      >
        <header className="flex flex-wrap items-center gap-3 border-b border-white/10 px-5 py-4">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter links…"
            aria-label="Filter launcher links"
            className="min-w-[12rem] flex-1 rounded-[var(--qs-border-radius)] border border-white/20 bg-black/5 px-3 py-2 text-sm outline-none ring-[color:var(--qs-color-accent)] focus:ring-2"
          />
          <button
            type="button"
            onClick={toggleCatalog}
            className="rounded-full border border-white/20 px-3 py-1.5 text-sm transition hover:bg-black/5"
          >
            {showFullCatalog ? "Workspace links" : "Full catalog"}
          </button>
          <button
            type="button"
            onClick={close}
            className="rounded-full px-3 py-1.5 text-sm opacity-70 transition hover:bg-black/5 hover:opacity-100"
          >
            Close
          </button>
        </header>

        <p className="px-5 pt-3 text-xs uppercase tracking-wide opacity-60">
          {scopeLabel} · {visibleLinks.length} links
        </p>

        <div className="overflow-y-auto px-5 pb-5 pt-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {visibleLinks.map((link) => (
              <LauncherLinkCard key={link.id} link={link} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
