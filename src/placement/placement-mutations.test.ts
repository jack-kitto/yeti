import { describe, expect, it } from "vitest";
import { addEdgeGroup, deleteEdgeGroup, updateEdgeGroup } from "./placement-mutations";
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

describe("updateEdgeGroup", () => {
  it("updates edge group name and handle icon", async () => {
    const seeded = await loadOrSeedLibrary({ read: async () => null, write: async () => {} });
    const library = addEdgeGroup(seeded, seeded.activeWorkspaceId, "left", {
      name: "Draft",
      handleIcon: "📝",
    });
    const groupId = resolveEdgeGroups(library, "left").find((g) => g.name === "Draft")!.id;

    const updated = updateEdgeGroup(library, seeded.activeWorkspaceId, "left", groupId, {
      name: "Drafts",
      handleIcon: "📄",
    });

    const group = resolveEdgeGroups(updated, "left").find((entry) => entry.id === groupId);
    expect(group?.name).toBe("Drafts");
    expect(group?.handleIcon).toBe("📄");
  });
});

describe("deleteEdgeGroup", () => {
  it("removes an edge group from the workspace edge", async () => {
    const seeded = await loadOrSeedLibrary({ read: async () => null, write: async () => {} });
    const library = addEdgeGroup(seeded, seeded.activeWorkspaceId, "left", {
      name: "Temporary",
    });
    const groupId = resolveEdgeGroups(library, "left").find((g) => g.name === "Temporary")!.id;

    const updated = deleteEdgeGroup(library, seeded.activeWorkspaceId, "left", groupId);

    expect(resolveEdgeGroups(updated, "left").some((group) => group.id === groupId)).toBe(false);
  });
});
