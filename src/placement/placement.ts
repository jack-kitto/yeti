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

export function resolvePins(library: Library): Link[] {
  const workspace = library.workspaces.find(
    (w) => w.id === library.activeWorkspaceId,
  );

  if (!workspace) {
    return [];
  }

  const catalogById = new Map(library.catalog.map((link) => [link.id, link]));

  const stripPins = workspace.placements.pins
    .filter(
      (pin): pin is typeof pin & { position: { kind: "strip"; order: number } } =>
        pin.position.kind === "strip",
    )
    .sort((a, b) => a.position.order - b.position.order);

  const seen = new Set<string>();
  const links: Link[] = [];

  for (const pin of stripPins) {
    if (seen.has(pin.linkId)) {
      continue;
    }

    const link = catalogById.get(pin.linkId);
    if (!link) {
      continue;
    }

    seen.add(pin.linkId);
    links.push(link);
  }

  return links;
}
