"use client";

import { useEffect, useState } from "react";
import { createIndexedDbLibraryStore } from "@/library/indexed-db-store";
import {
  resolveStartPageLibrary,
  type ResolvedStartPageLibrary,
} from "@/start/resolve-start-page-library";
import {
  initialStartPagePhase,
  readyStartPagePhase,
  type StartPagePhase,
} from "@/start/start-page-shell";

const store = createIndexedDbLibraryStore();

export function useStartPageLibrary(): {
  phase: StartPagePhase;
  resolved: ResolvedStartPageLibrary | null;
} {
  const [phase, setPhase] = useState<StartPagePhase>(initialStartPagePhase);
  const [resolved, setResolved] = useState<ResolvedStartPageLibrary | null>(null);

  useEffect(() => {
    let cancelled = false;

    void resolveStartPageLibrary(store).then((next) => {
      if (cancelled) {
        return;
      }
      setResolved(next);
      setPhase(readyStartPagePhase());
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { phase, resolved };
}
