import { describe, expect, it } from "vitest";
import { addEdgeGroup } from "./placement-mutations";
import { resolveEdgeGroups } from "./placement";
import { loadOrSeedLibrary } from "@/library/library";

describe("addEdgeGroup", () => {
  it("adds an edge group to the active workspace on the chosen edge", async () => {
    const library = await loadOrSeedLibrary({
      read: async () => null,
      write: async () => {},
    });
    const workspaceId = library.activeWorkspaceId;
    const beforeCount = library.workspaces.find((w) => w.id === workspaceId)!
      .placements.edges.left.length;

    const updated = addEdgeGroup(library, workspaceId, "left", {
      name: "Side projects",
      handleIcon: "🚀",
    });

    const groups = resolveEdgeGroups(updated, "left");
    expect(groups).toHaveLength(beforeCount + 1);
    const added = groups.find((group) => group.name === "Side projects");
    expect(added?.handleIcon).toBe("🚀");
    expect(added?.links).toEqual([]);
  });
});
