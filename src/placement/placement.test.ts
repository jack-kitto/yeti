import { describe, expect, it } from "vitest";
import { EDGE_PREVIEW_LIMIT, resolveEdgeLinks } from "./placement";
import type { Library } from "@/library/types";

function makeLibrary(leftLinkIds: string[]): Library {
  const catalog = leftLinkIds.map((id) => ({
    id,
    url: `https://${id}.example.com`,
    title: id,
  }));

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
          edges: { left: leftLinkIds, top: [], bottom: [] },
          pins: [],
        },
      },
    ],
    shortcuts: { focusCommandBar: "Meta+Shift+k", cycleWorkspace: "Control+Tab" },
    activeWorkspaceId: "work",
  };
}

describe("resolveEdgeLinks", () => {
  it("returns links for the active workspace edge in placement order", () => {
    const library = makeLibrary(["alpha", "beta", "gamma"]);

    const result = resolveEdgeLinks(library, "left");

    expect(result.links.map((l) => l.id)).toEqual(["alpha", "beta", "gamma"]);
    expect(result.totalCount).toBe(3);
    expect(result.hasMore).toBe(false);
  });

  it("truncates flyout preview to 8 links and sets hasMore", () => {
    const ids = Array.from({ length: 10 }, (_, i) => `link-${i}`);
    const library = makeLibrary(ids);

    const result = resolveEdgeLinks(library, "left");

    expect(result.links).toHaveLength(EDGE_PREVIEW_LIMIT);
    expect(result.links[0].id).toBe("link-0");
    expect(result.links[7].id).toBe("link-7");
    expect(result.totalCount).toBe(10);
    expect(result.hasMore).toBe(true);
  });
});
