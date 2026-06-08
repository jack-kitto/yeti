"use client";

import { useEffect, useRef } from "react";
import { applyTheme } from "@/theme/theme";
import { useApplyLibraryPatch, useLibrary } from "@/hooks/use-library";
import { WorkspaceSwitcher } from "./workspace-switcher";

export function Shell() {
  const shellRef = useRef<HTMLDivElement>(null);
  const { data: library, isLoading } = useLibrary();
  const applyLibraryPatch = useApplyLibraryPatch();

  const activeWorkspace = library?.workspaces.find(
    (w) => w.id === library.activeWorkspaceId,
  );

  useEffect(() => {
    if (shellRef.current && activeWorkspace) {
      applyTheme(shellRef.current, activeWorkspace.theme);
    }
  }, [activeWorkspace]);

  if (isLoading || !library || !activeWorkspace) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm opacity-70">
        Loading shell…
      </div>
    );
  }

  return (
    <div ref={shellRef} className="relative min-h-screen">
      <div
        className="pointer-events-none absolute inset-0 bg-[color:var(--qs-color-background)]"
        style={{ opacity: 1 - activeWorkspace.theme.glassOpacity }}
        aria-hidden
      />

      <div className="absolute inset-y-0 left-0 w-3" aria-label="Left edge" />
      <div className="absolute inset-x-0 top-0 h-3" aria-label="Top edge" />
      <div
        className="absolute inset-x-0 bottom-0 h-3"
        aria-label="Bottom edge"
      />
      <div className="absolute inset-y-0 right-0 w-3" aria-label="Right edge" />

      <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-8">
        <WorkspaceSwitcher
          library={library}
          onSwitch={(workspaceId) =>
            applyLibraryPatch.mutate({ activeWorkspaceId: workspaceId })
          }
        />
        <p className="max-w-md text-center text-sm opacity-80">
          {activeWorkspace.name} workspace — canvas and command bar land in
          later slices.
        </p>
      </main>
    </div>
  );
}
