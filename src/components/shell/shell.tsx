"use client";

import { useEffect, useState } from "react";
import { useApplyLibraryPatch, useLibrary, useSaveLibrary } from "@/hooks/use-library";
import { applyTheme } from "@/theme/theme";
import { reorderEdgeGroupOnRim } from "@/placement/placement";
import { getShellLayout } from "@/shell-frame/layout";
import { CanvasWidgetStack } from "./canvas-widget-stack";
import { Launcher } from "./launcher";
import { ShellConfigDialog } from "./shell-config-dialog";
import { ShellCanvas } from "./shell-canvas";
import { FocusRadioPlaybackProvider } from "./focus-radio-playback-context";
import { ShellEdgeLayer } from "./shell-edge-layer";

type PanelBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function readPanelBounds(): PanelBounds {
  const layout = getShellLayout();
  return {
    left: layout.panelX,
    top: layout.panelY,
    width: layout.panelW,
    height: layout.panelH,
  };
}

export function Shell() {
  const { data: library, isLoading } = useLibrary();
  const applyLibraryPatch = useApplyLibraryPatch();
  const saveLibraryMutation = useSaveLibrary();
  const [panelBounds, setPanelBounds] = useState<PanelBounds>(readPanelBounds);

  const activeWorkspace = library?.workspaces.find(
    (w) => w.id === library.activeWorkspaceId,
  );

  useEffect(() => {
    if (!activeWorkspace) {
      return;
    }
    applyTheme(document.documentElement, activeWorkspace.theme);
  }, [activeWorkspace]);

  useEffect(() => {
    function handleResize() {
      setPanelBounds(readPanelBounds());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleReorderGroup(groupId: string, targetSlotIndex: number) {
    if (!library) {
      return;
    }

    const updated = reorderEdgeGroupOnRim(library, "left", groupId, targetSlotIndex);
    saveLibraryMutation.mutate(updated);
  }

  if (isLoading || !library || !activeWorkspace) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm opacity-70">
        Loading shell…
      </div>
    );
  }

  return (
    <FocusRadioPlaybackProvider library={library}>
      <div className="relative h-screen w-screen overflow-hidden">
        <ShellCanvas theme={activeWorkspace.theme} />
        <ShellEdgeLayer
          library={library}
          onReorderGroup={handleReorderGroup}
          onSwitchWorkspace={(workspaceId) =>
            applyLibraryPatch.mutate({ activeWorkspaceId: workspaceId })
          }
          onUpdateInternalTools={(internalTools) =>
            saveLibraryMutation.mutate({
              ...library,
              workspaces: library.workspaces.map((workspace) =>
                workspace.id === library.activeWorkspaceId
                  ? { ...workspace, internalTools }
                  : workspace,
              ),
            })
          }
        />

        <main
          className="pointer-events-none absolute z-10 flex flex-col items-center px-8"
          style={{
            left: panelBounds.left,
            top: panelBounds.top,
            width: panelBounds.width,
            height: panelBounds.height,
          }}
        >
          <div
            className="pointer-events-auto absolute left-0 flex w-full justify-center px-8"
            style={{ top: "40%", transform: "translateY(-50%)" }}
          >
            <CanvasWidgetStack workspace={activeWorkspace} />
          </div>
        </main>

        <Launcher library={library} />
        <ShellConfigDialog
          library={library}
          workspaceName={activeWorkspace.name}
        />
      </div>
    </FocusRadioPlaybackProvider>
  );
}
