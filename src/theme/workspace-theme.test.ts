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

  it("records manual palette edits as overrides", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const workspaceId = library.activeWorkspaceId;

    const updated = updateWorkspaceTheme(library, workspaceId, {
      palette: { accent: "#112233" },
    });

    const workspace = updated.workspaces.find((entry) => entry.id === workspaceId);
    expect(workspace?.theme.palette.accent).toBe("#112233");
    expect(workspace?.theme.paletteOverrides).toEqual({ accent: "#112233" });
  });

  it("does not record palette overrides when recordPaletteOverrides is false", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const workspaceId = library.activeWorkspaceId;

    const updated = updateWorkspaceTheme(library, workspaceId, {
      palette: {
        background: "#111111",
        surface: "#222222",
        text: "#eeeeee",
        accent: "#ff5500",
      },
      paletteExtractedFromUrl: "https://example.com/bg.jpg",
      recordPaletteOverrides: false,
    });

    const workspace = updated.workspaces.find((entry) => entry.id === workspaceId);
    expect(workspace?.theme.palette.background).toBe("#111111");
    expect(workspace?.theme.paletteOverrides).toBeUndefined();
    expect(workspace?.theme.paletteExtractedFromUrl).toBe("https://example.com/bg.jpg");
  });

  it("clears extraction marker when the background URL changes", async () => {
    const library = await loadOrSeedLibrary(createInMemoryLibraryStore());
    const workspaceId = library.activeWorkspaceId;
    const withExtraction = updateWorkspaceTheme(library, workspaceId, {
      backgroundUrl: "https://example.com/old.jpg",
      paletteExtractedFromUrl: "https://example.com/old.jpg",
      recordPaletteOverrides: false,
    });

    const updated = updateWorkspaceTheme(withExtraction, workspaceId, {
      backgroundUrl: "https://example.com/new.jpg",
    });

    const workspace = updated.workspaces.find((entry) => entry.id === workspaceId);
    expect(workspace?.theme.backgroundUrl).toBe("https://example.com/new.jpg");
    expect(workspace?.theme.paletteExtractedFromUrl).toBeUndefined();
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
