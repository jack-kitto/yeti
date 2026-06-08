import { openDB } from "idb";
import type { Library, LibraryStore } from "./types";

const DB_NAME = "quickshell";
const STORE_NAME = "library";
const LIBRARY_KEY = "library";

export function createIndexedDbLibraryStore(): LibraryStore {
  async function getDb() {
    return openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME);
      },
    });
  }

  return {
    async read() {
      const db = await getDb();
      return (await db.get(STORE_NAME, LIBRARY_KEY)) ?? null;
    },
    async write(library: Library) {
      const db = await getDb();
      await db.put(STORE_NAME, library, LIBRARY_KEY);
    },
  };
}
