"use client";

import { useEffect, useMemo, useState } from "react";
import {
  resolveLinkImageUrl,
  resolveLinkTitle,
} from "@/link-display/link-display";
import type { Library, Link } from "@/library/types";
import {
  resolveEdgeGroupLinks,
  resolveEdgeGroupName,
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
      className="flex flex-col items-center gap-2 rounded-[calc(var(--qs-border-radius)-4px)] bg-[color:var(--qs-color-surface)]/60 p-4 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06)] transition-[transform,background-color,box-shadow] duration-150 ease-[cubic-bezier(0.2,0,0,1)] hover:bg-[color:var(--qs-color-surface)]/90 hover:shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.08)] active:scale-[0.96]"
      title={title}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          width={40}
          height={40}
          className="shell-image rounded-lg"
        />
      ) : (
        <span className="inline-block h-10 w-10 rounded-lg bg-black/10" />
      )}
      <span className="line-clamp-2 text-sm text-balance">{title}</span>
    </a>
  );
}

export function Launcher({ library }: LauncherProps) {
  const { open, edge, edgeGroupId, showFullCatalog, close, toggleCatalog } =
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

    if (edge && edgeGroupId) {
      return resolveEdgeGroupLinks(library, edge, edgeGroupId);
    }

    return resolveWorkspacePlacedLinks(library);
  }, [library, edge, edgeGroupId, showFullCatalog]);

  const visibleLinks = useMemo(
    () => filterLinks(baseLinks, query),
    [baseLinks, query],
  );

  if (!open) {
    return null;
  }

  const edgeGroupName =
    edge && edgeGroupId ? resolveEdgeGroupName(library, edge, edgeGroupId) : null;

  const scopeLabel = showFullCatalog
    ? "Full catalog"
    : edgeGroupName
      ? edgeGroupName
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
        className="relative flex max-h-[min(85vh,48rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[var(--qs-border-radius)] bg-[color:var(--qs-color-surface)]/95 shadow-[0_2px_4px_rgba(0,0,0,0.04),0_16px_48px_rgba(0,0,0,0.12)] backdrop-blur-xl"
      >
        <header className="flex flex-wrap items-center gap-3 px-5 py-4 shadow-[inset_0_-1px_0_rgba(0,0,0,0.06)]">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter links…"
            aria-label="Filter launcher links"
            className="min-w-[12rem] flex-1 rounded-[calc(var(--qs-border-radius)-4px)] bg-black/5 px-3 py-2 text-sm outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.06)] ring-[color:var(--qs-color-accent)] focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.14)] focus:ring-2"
          />
          <button
            type="button"
            onClick={toggleCatalog}
            className="rounded-full px-3 py-1.5 text-sm transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.2,0,0,1)] hover:bg-black/5 active:scale-[0.96]"
          >
            {showFullCatalog ? "Workspace links" : "Full catalog"}
          </button>
          <button
            type="button"
            onClick={close}
            className="rounded-full px-3 py-1.5 text-sm opacity-70 transition-[transform,opacity,background-color] duration-150 ease-[cubic-bezier(0.2,0,0,1)] hover:bg-black/5 hover:opacity-100 active:scale-[0.96]"
          >
            Close
          </button>
        </header>

        <p className="px-5 pt-3 text-xs uppercase tracking-wide opacity-60">
          {scopeLabel} · <span className="tabular-nums">{visibleLinks.length}</span> links
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
