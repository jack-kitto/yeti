"use client";

import { useEffect, useRef } from "react";
import { applyTheme } from "@/theme/theme";
import { useApplyLibraryPatch, useLibrary, useSaveLibrary } from "@/hooks/use-library";
import { reorderEdgeGroupOnRim } from "@/placement/placement";
import type { EdgePosition } from "@/library/types";
import { CommandBar } from "./command-bar";
import { EdgeRim } from "./edge-rim";
import { Launcher } from "./launcher";
import { PinStrip } from "./pin-strip";
import { WorkspaceSwitcher } from "./workspace-switcher";

export function Shell() {
  const shellRef = useRef<HTMLDivElement>(null);
  const { data: library, isLoading } = useLibrary();
  const applyLibraryPatch = useApplyLibraryPatch();
  const saveLibraryMutation = useSaveLibrary();

  function handleReorderGroup(edge: EdgePosition, groupId: string, targetSlotIndex: number) {
    if (!library) {
      return;
    }

    const updated = reorderEdgeGroupOnRim(library, edge, groupId, targetSlotIndex);
    saveLibraryMutation.mutate(updated);
  }

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

      <EdgeRim
        edge="left"
        library={library}
        onReorderGroup={(groupId, targetSlotIndex) =>
          handleReorderGroup("left", groupId, targetSlotIndex)
        }
      />
      <EdgeRim
        edge="top"
        library={library}
        onReorderGroup={(groupId, targetSlotIndex) =>
          handleReorderGroup("top", groupId, targetSlotIndex)
        }
      />
      <EdgeRim
        edge="bottom"
        library={library}
        onReorderGroup={(groupId, targetSlotIndex) =>
          handleReorderGroup("bottom", groupId, targetSlotIndex)
        }
      />
      <div className="absolute inset-y-0 right-0 w-3" aria-label="Right edge" />

      <Launcher library={library} />

      <main className="relative flex min-h-screen flex-col items-center justify-center gap-4 px-8">
        <WorkspaceSwitcher
          library={library}
          onSwitch={(workspaceId) =>
            applyLibraryPatch.mutate({ activeWorkspaceId: workspaceId })
          }
        />
        <CommandBar
          library={library}
          onSwitchWorkspace={(workspaceId) =>
            applyLibraryPatch.mutate({ activeWorkspaceId: workspaceId })
          }
        />
        <PinStrip library={library} />
        <p className="max-w-md text-center text-sm opacity-80">
          Hover an edge handle for links. {activeWorkspace.name} workspace active.
        </p>
      </main>
    </div>
  );
}
