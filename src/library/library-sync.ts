export type LibrarySyncAdapter = {
  notifyChange: () => void;
  subscribe: (onChange: () => void) => () => void;
};

export function createMemoryLibrarySync(): LibrarySyncAdapter {
  const listeners = new Set<() => void>();

  return {
    notifyChange() {
      for (const listener of listeners) {
        listener();
      }
    },
    subscribe(onChange) {
      listeners.add(onChange);
      return () => {
        listeners.delete(onChange);
      };
    },
  };
}

export function createBroadcastLibrarySync(
  channelName = "yeti-library-change",
): LibrarySyncAdapter {
  const channel = new BroadcastChannel(channelName);

  return {
    notifyChange() {
      channel.postMessage(null);
    },
    subscribe(onChange) {
      channel.onmessage = () => {
        onChange();
      };
      return () => {
        channel.close();
      };
    },
  };
}

let activeSync: LibrarySyncAdapter | null = null;

export function getLibrarySync(): LibrarySyncAdapter {
  if (!activeSync) {
    activeSync =
      typeof BroadcastChannel !== "undefined"
        ? createBroadcastLibrarySync()
        : createMemoryLibrarySync();
  }

  return activeSync;
}

export function setLibrarySyncForTests(adapter: LibrarySyncAdapter): void {
  activeSync = adapter;
}

export function resetLibrarySyncForTests(): void {
  activeSync = null;
}

export function notifyLibraryChanged(): void {
  getLibrarySync().notifyChange();
}
