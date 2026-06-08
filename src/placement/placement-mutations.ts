import { initialKey, insertBetween, sortByKey } from "@/fractional-order/fractional-order";
import type {
  EdgeGroup,
  EdgePosition,
  Library,
  Workspace,
} from "@/library/types";

export type EdgeGroupInput = {
  name: string;
  handleIcon?: string;
};

export type EdgeGroupPatch = {
  name?: string;
  handleIcon?: string;
};

function createEdgeGroupId(): string {
  return crypto.randomUUID();
}

function findWorkspace(library: Library, workspaceId: string): Workspace {
  const workspace = library.workspaces.find((entry) => entry.id === workspaceId);
  if (!workspace) {
    throw new Error(`Workspace "${workspaceId}" not found`);
  }
  return workspace;
}

function updateWorkspace(
  library: Library,
  workspaceId: string,
  update: (workspace: Workspace) => Workspace,
): Library {
  return {
    ...library,
    workspaces: library.workspaces.map((workspace) =>
      workspace.id === workspaceId ? update(workspace) : workspace,
    ),
  };
}

function nextOrderKey(groups: readonly EdgeGroup[]): string {
  const sorted = sortByKey([...groups], (group) => group.orderKey);
  const last = sorted.at(-1);
  return last ? insertBetween(last.orderKey, null) : initialKey();
}

export function addEdgeGroup(
  library: Library,
  workspaceId: string,
  edge: EdgePosition,
  input: EdgeGroupInput,
): Library {
  const name = input.name.trim();
  if (!name) {
    throw new Error("Edge group name is required");
  }

  const workspace = findWorkspace(library, workspaceId);
  const groups = workspace.placements.edges[edge];

  const group: EdgeGroup = {
    id: createEdgeGroupId(),
    name,
    orderKey: nextOrderKey(groups),
    links: [],
    ...(input.handleIcon?.trim() ? { handleIcon: input.handleIcon.trim() } : {}),
  };

  return updateWorkspace(library, workspaceId, (current) => ({
    ...current,
    placements: {
      ...current.placements,
      edges: {
        ...current.placements.edges,
        [edge]: [...groups, group],
      },
    },
  }));
}
