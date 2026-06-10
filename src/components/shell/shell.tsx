"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useApplyLibraryPatch, useLibrary, useMutateLibrary, useSaveLibrary } from "@/hooks/use-library";
import { usePomodoroPhaseAdvance } from "@/hooks/use-pomodoro-phase-advance";
import type { Library, Workspace } from "@/library/types";
import { getShellLayout } from "@/shell-frame/layout";
import {
  getWorkspaceTransitionSnapshot,
  isWorkspaceTransitionRunning,
  startWorkspaceTransition,
  subscribeWorkspaceTransition,
} from "@/shell-frame/workspace-transition";
import { applyTheme, lerpPalette } from "@/theme/theme";
import { reorderEdgeGroupOnRim } from "@/placement/placement";
import { CanvasWidgetStack } from "./canvas-widget-stack";
import { Launcher } from "./launcher";
import { ShellConfigDialog } from "./shell-config-dialog";
import { ShellCanvas } from "./shell-canvas";
import { ShellRimBackdrop } from "./shell-rim-backdrop";
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
  const workspaceTransition = useSyncExternalStore(
    subscribeWorkspaceTransition,
    getWorkspaceTransitionSnapshot,
    getWorkspaceTransitionSnapshot,
  );

  const activeWorkspace = library?.workspaces.find((w) => w.id === library.activeWorkspaceId);

  const switchWorkspace = useCallback(
    (workspaceId: string) => {
      if (!library || workspaceId === library.activeWorkspaceId) {
        return;
      }
      if (isWorkspaceTransitionRunning()) {
        return;
      }

      const fromWorkspace = library.workspaces.find(
        (workspace) => workspace.id === library.activeWorkspaceId,
      );
      if (!fromWorkspace) {
        return;
      }

      startWorkspaceTransition({
        fromPalette: fromWorkspace.theme.palette,
        fromBackgroundUrl: fromWorkspace.theme.backgroundUrl,
        onSwap: () => applyLibraryPatch.mutate({ activeWorkspaceId: workspaceId }),
      });
    },
    [applyLibraryPatch, library],
  );

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
    <ShellLoaded
      library={library}
      activeWorkspace={activeWorkspace}
      panelBounds={panelBounds}
      workspaceTransition={workspaceTransition}
      onReorderGroup={handleReorderGroup}
      onSwitchWorkspace={switchWorkspace}
      saveLibraryMutation={saveLibraryMutation}
    />
  );
}

type ShellLoadedProps = {
  library: Library;
  activeWorkspace: Workspace;
  panelBounds: PanelBounds;
  workspaceTransition: ReturnType<typeof getWorkspaceTransitionSnapshot>;
  onReorderGroup: (groupId: string, targetSlotIndex: number) => void;
  onSwitchWorkspace: (workspaceId: string) => void;
  saveLibraryMutation: ReturnType<typeof useSaveLibrary>;
};

function ShellLoaded({
  library,
  activeWorkspace,
  panelBounds,
  workspaceTransition,
  onReorderGroup,
  onSwitchWorkspace,
  saveLibraryMutation,
}: ShellLoadedProps) {
  const mutateLibrary = useMutateLibrary();

  const displayTheme = useMemo(() => {
    if (workspaceTransition.running && workspaceTransition.fromPalette) {
      const palette =
        workspaceTransition.paletteMorph < 1
          ? lerpPalette(
              workspaceTransition.fromPalette,
              activeWorkspace.theme.palette,
              workspaceTransition.paletteMorph,
            )
          : activeWorkspace.theme.palette;

      return {
        ...activeWorkspace.theme,
        palette,
        backgroundUrl: workspaceTransition.fromBackgroundUrl ?? activeWorkspace.theme.backgroundUrl,
      };
    }

    return activeWorkspace.theme;
  }, [activeWorkspace.theme, workspaceTransition]);

  useEffect(() => {
    applyTheme(document.documentElement, displayTheme);
  }, [displayTheme]);

  const handlePomodoroAdvance = useCallback(
    (nextPomodoro: Workspace["internalTools"]["pomodoro"]) => {
      mutateLibrary.mutate((current) => ({
        ...current,
        workspaces: current.workspaces.map((entry) =>
          entry.id === activeWorkspace.id
            ? {
                ...entry,
                internalTools: {
                  ...entry.internalTools,
                  pomodoro: nextPomodoro,
                },
              }
            : entry,
        ),
      }));
    },
    [activeWorkspace.id, mutateLibrary],
  );

  usePomodoroPhaseAdvance(activeWorkspace, library, handlePomodoroAdvance);

  return (
    <FocusRadioPlaybackProvider library={library}>
      <div className="relative isolate h-screen w-screen overflow-hidden">
        <main
          className="pointer-events-none absolute z-[1] flex flex-col items-center px-8"
          style={{
            left: panelBounds.left,
            top: panelBounds.top,
            width: panelBounds.width,
            height: panelBounds.height,
            opacity: 1 - workspaceTransition.seal,
          }}
        >
          <div className="pointer-events-none absolute inset-0 px-6 sm:px-8">
            <CanvasWidgetStack workspace={activeWorkspace} />
          </div>
        </main>

        <ShellRimBackdrop theme={displayTheme} />
        <ShellCanvas theme={displayTheme} />

        <ShellEdgeLayer
          library={library}
          onReorderGroup={onReorderGroup}
          onSwitchWorkspace={onSwitchWorkspace}
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

        <Launcher library={library} />
        <ShellConfigDialog library={library} workspaceName={activeWorkspace.name} />
      </div>
    </FocusRadioPlaybackProvider>
  );
}
