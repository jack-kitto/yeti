import { describe, expect, it } from "vitest";
import { EDGE_PREVIEW_LIMIT, resolveEdgeLinks, resolvePins } from "./placement";
import type { Library, PinPosition } from "@/library/types";

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

function makeLibraryWithPins(
  pinEntries: { linkId: string; position: PinPosition }[],
): Library {
  const catalog = pinEntries.map(({ linkId }) => ({
    id: linkId,
    url: `https://${linkId}.example.com`,
    title: linkId,
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
          edges: { left: [], top: [], bottom: [] },
          pins: pinEntries,
        },
      },
    ],
    shortcuts: { focusCommandBar: "Meta+Shift+k", cycleWorkspace: "Control+Tab" },
    activeWorkspaceId: "work",
  };
}

describe("resolvePins", () => {
  it("returns strip pins for the active workspace in placement order", () => {
    const library = makeLibraryWithPins([
      { linkId: "beta", position: { kind: "strip", order: 1 } },
      { linkId: "alpha", position: { kind: "strip", order: 0 } },
      { linkId: "gamma", position: { kind: "strip", order: 2 } },
    ]);

    const result = resolvePins(library);

    expect(result.map((l) => l.id)).toEqual(["alpha", "beta", "gamma"]);
  });

  it("excludes freeform pins from the strip", () => {
    const library = makeLibraryWithPins([
      { linkId: "alpha", position: { kind: "strip", order: 0 } },
      { linkId: "beta", position: { kind: "freeform", x: 0.5, y: 0.5 } },
    ]);

    const result = resolvePins(library);

    expect(result.map((l) => l.id)).toEqual(["alpha"]);
  });

  it("keeps only one pin per link when duplicates exist in placement data", () => {
    const library = makeLibraryWithPins([
      { linkId: "alpha", position: { kind: "strip", order: 0 } },
      { linkId: "alpha", position: { kind: "strip", order: 2 } },
      { linkId: "beta", position: { kind: "strip", order: 1 } },
    ]);

    const result = resolvePins(library);

    expect(result.map((l) => l.id)).toEqual(["alpha", "beta"]);
  });
});
