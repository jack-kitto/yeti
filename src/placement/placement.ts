import type { EdgePosition, Library, Link } from "@/library/types";

export const EDGE_PREVIEW_LIMIT = 8;

export type ResolvedEdgeLinks = {
  links: Link[];
  totalCount: number;
  hasMore: boolean;
};

export function resolveEdgeLinks(
  library: Library,
  edge: EdgePosition,
): ResolvedEdgeLinks {
  const workspace = library.workspaces.find(
    (w) => w.id === library.activeWorkspaceId,
  );

  if (!workspace) {
    return { links: [], totalCount: 0, hasMore: false };
  }

  const catalogById = new Map(library.catalog.map((link) => [link.id, link]));
  const allLinks = workspace.placements.edges[edge]
    .map((id) => catalogById.get(id))
    .filter((link): link is Link => link !== undefined);

  return {
    links: allLinks.slice(0, EDGE_PREVIEW_LIMIT),
    totalCount: allLinks.length,
    hasMore: allLinks.length > EDGE_PREVIEW_LIMIT,
  };
}
