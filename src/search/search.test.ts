import { describe, expect, it } from "vitest";
import { searchLinks, searchWorkspaces } from "./search";
import type { Library, Link } from "@/library/types";

function link(id: string, title: string): Link {
  return { id, url: `https://${id}.example.com`, title };
}

function makeLibrary(
  catalog: Link[],
  placedIds: string[],
  activeWorkspaceId = "work",
): Library {
  return {
    catalog,
    workspaces: [
      {
        id: "work",
        name: "Work",
        theme: {
          palette: {
            background: "#000",
            surface: "#111",
            text: "#fff",
            accent: "#f00",
          },
          glassOpacity: 0.7,
          borderRadius: 16,
        },
        placements: {
          edges: { left: placedIds, top: [], bottom: [] },
          pins: [],
        },
      },
    ],
    shortcuts: { focusCommandBar: "Meta+Shift+k", cycleWorkspace: "Control+Tab" },
    activeWorkspaceId,
  };
}

describe("searchLinks", () => {
  it("returns placed links in the active workspace that fuzzy-match the query", () => {
    const library = makeLibrary(
      [link("github", "GitHub"), link("mdn", "MDN")],
      ["github"],
    );

    const results = searchLinks(library, "git");

    expect(results).toEqual([
      { link: library.catalog[0], source: "workspace" },
    ]);
  });

  it("ranks placed workspace links above unplaced catalog links", () => {
    const library = makeLibrary(
      [link("github", "GitHub"), link("gitlab", "GitLab")],
      ["github"],
    );

    const results = searchLinks(library, "git");

    expect(results.map((r) => r.link.id)).toEqual(["github", "gitlab"]);
    expect(results.map((r) => r.source)).toEqual(["workspace", "catalog"]);
  });

  it("includes unplaced catalog links as fallback results", () => {
    const library = makeLibrary([link("archive", "Archive Docs")], []);

    const results = searchLinks(library, "arch");

    expect(results).toEqual([
      { link: library.catalog[0], source: "catalog" },
    ]);
  });

  it("matches non-contiguous substrings in link titles", () => {
    const library = makeLibrary([link("github", "GitHub")], ["github"]);

    const results = searchLinks(library, "gh");

    expect(results).toHaveLength(1);
    expect(results[0].link.id).toBe("github");
  });
});

describe("searchWorkspaces", () => {
  it("returns workspaces whose names fuzzy-match the query", () => {
    const library = makeLibrary([link("github", "GitHub")], ["github"]);
    library.workspaces.push({
      id: "personal",
      name: "Personal",
      theme: library.workspaces[0].theme,
      placements: {
        edges: { left: [], top: [], bottom: [] },
        pins: [],
      },
    });

    const results = searchWorkspaces(library, "pers");

    expect(results.map((w) => w.id)).toEqual(["personal"]);
  });
});
