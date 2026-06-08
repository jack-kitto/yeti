import type { CatalogLinkInput, CatalogLinkPatch, Library, Link } from "./types";

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

export function updateCatalogLink(
  library: Library,
  linkId: string,
  patch: CatalogLinkPatch,
): Library {
  const index = library.catalog.findIndex((link) => link.id === linkId);
  if (index === -1) {
    throw new Error(`Catalog link "${linkId}" not found`);
  }

  const current = library.catalog[index];
  const nextUrl = patch.url !== undefined ? patch.url.trim() : current.url;
  if (!nextUrl) {
    throw new Error("Link URL is required");
  }

  const updated: Link = {
    ...current,
    url: nextUrl,
    ...(patch.title !== undefined ? { title: patch.title } : {}),
    ...(patch.image !== undefined ? { image: patch.image } : {}),
  };

  const catalog = [...library.catalog];
  catalog[index] = updated;

  return {
    ...library,
    catalog,
  };
}
