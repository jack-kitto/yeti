import { describe, expect, it } from "vitest";
import { addCatalogLink } from "./catalog";
import { loadOrSeedLibrary } from "./library";
import { createInMemoryLibraryStore } from "./store";

describe("addCatalogLink", () => {
  it("adds a link with a URL to the catalog", async () => {
    const store = createInMemoryLibraryStore();
    const library = await loadOrSeedLibrary(store);
    const beforeCount = library.catalog.length;

    const updated = addCatalogLink(library, { url: "https://example.com/docs" });

    expect(updated.catalog).toHaveLength(beforeCount + 1);
    const added = updated.catalog.find((link) => link.url === "https://example.com/docs");
    expect(added).toBeDefined();
    expect(added!.id).toBeTruthy();
  });
});
