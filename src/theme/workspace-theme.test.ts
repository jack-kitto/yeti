import { describe, expect, it } from "vitest";
import { loadOrSeedLibrary } from "@/library/library";
import { createInMemoryLibraryStore } from "@/library/store";
import { updateWorkspaceTheme } from "./workspace-theme";

describe("updateWorkspaceTheme", () => {
  it("updates the palette on a workspace theme", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const workspaceId = library.activeWorkspaceId;

    const updated = updateWorkspaceTheme(library, workspaceId, {
      palette: { accent: "#112233" },
    });

    const workspace = updated.workspaces.find((entry) => entry.id === workspaceId);
    expect(workspace?.theme.palette.accent).toBe("#112233");
    expect(workspace?.theme.palette.background).toBeTruthy();
  });

  it("updates background image URL and glass styling", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const workspaceId = library.activeWorkspaceId;

    const updated = updateWorkspaceTheme(library, workspaceId, {
      backgroundUrl: "https://example.com/bg.jpg",
      glassOpacity: 0.5,
      borderRadius: 12,
    });

    const workspace = updated.workspaces.find((entry) => entry.id === workspaceId);
    expect(workspace?.theme.backgroundUrl).toBe("https://example.com/bg.jpg");
    expect(workspace?.theme.glassOpacity).toBe(0.5);
    expect(workspace?.theme.borderRadius).toBe(12);
  });

  it("updates shell surface on a workspace theme", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const workspaceId = library.activeWorkspaceId;

    const updated = updateWorkspaceTheme(library, workspaceId, {
      shellSurface: "transparent",
    });

    const workspace = updated.workspaces.find((entry) => entry.id === workspaceId);
    expect(workspace?.theme.shellSurface).toBe("transparent");
  });

  it("merges per-widget style patches onto defaults", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const workspaceId = library.activeWorkspaceId;

    const updated = updateWorkspaceTheme(library, workspaceId, {
      widgets: {
        clock: {
          text: "#ffffff",
          textMuted: "#dddddd",
          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
        },
      },
    });

    const workspace = updated.workspaces.find((entry) => entry.id === workspaceId);
    expect(workspace?.theme.widgets.clock?.text).toBe("#ffffff");
    expect(workspace?.theme.widgets.clock?.zone).toBe("upper-center");
  });

  it("clears the background image when backgroundUrl is null", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const workspaceId = library.activeWorkspaceId;
    const withBackground = updateWorkspaceTheme(library, workspaceId, {
      backgroundUrl: "https://example.com/bg.jpg",
    });

    const updated = updateWorkspaceTheme(withBackground, workspaceId, {
      backgroundUrl: null,
    });

    const workspace = updated.workspaces.find((entry) => entry.id === workspaceId);
    expect(workspace?.theme.backgroundUrl).toBeUndefined();
  });
});
