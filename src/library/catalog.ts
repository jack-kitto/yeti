import type { CatalogLinkInput, Library, Link } from "./types";

function createLinkId(): string {
  return crypto.randomUUID();
}

export function addCatalogLink(library: Library, input: CatalogLinkInput): Library {
  const url = input.url.trim();
  if (!url) {
    throw new Error("Link URL is required");
  }

  const link: Link = {
    id: createLinkId(),
    url,
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.image !== undefined ? { image: input.image } : {}),
  };

  return {
    ...library,
    catalog: [...library.catalog, link],
  };
}
