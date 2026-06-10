import { describe, expect, it } from "vitest";
import { LIBRARY_DB_NAME, PRODUCT_NAME, SNAPSHOT_DOWNLOAD_FILENAME } from "./branding";

describe("Yeti branding constants", () => {
  it("uses yeti as the IndexedDB database name", () => {
    expect(LIBRARY_DB_NAME).toBe("yeti");
  });

  it("names exported library snapshots yeti-snapshot.yaml", () => {
    expect(SNAPSHOT_DOWNLOAD_FILENAME).toBe("yeti-snapshot.yaml");
  });

  it("uses Yeti as the product name", () => {
    expect(PRODUCT_NAME).toBe("Yeti");
  });
});
