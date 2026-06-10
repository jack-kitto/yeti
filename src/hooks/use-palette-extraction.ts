"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Library, Theme } from "@/library/types";
import {
  extractPaletteFromImageUrl,
  mergeExtractedPalette,
  needsPaletteExtraction,
} from "@/theme/palette-extraction";
import { useUpdateWorkspaceTheme } from "./use-library";

function isLikelyImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function usePaletteExtraction(library: Library | undefined) {
  const updateWorkspaceTheme = useUpdateWorkspaceTheme();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const inflightRef = useRef(new Set<string>());

  const extractForWorkspace = useCallback(
    async (workspaceId: string, theme: Theme) => {
      if (
        !theme.backgroundUrl ||
        !needsPaletteExtraction(theme) ||
        !isLikelyImageUrl(theme.backgroundUrl)
      ) {
        return;
      }

      if (inflightRef.current.has(workspaceId)) {
        return;
      }

      inflightRef.current.add(workspaceId);

      try {
        const extracted = await extractPaletteFromImageUrl(theme.backgroundUrl);
        await updateWorkspaceTheme.mutateAsync({
          workspaceId,
          patch: {
            palette: mergeExtractedPalette(extracted, theme.paletteOverrides),
            paletteExtractedFromUrl: theme.backgroundUrl,
            recordPaletteOverrides: false,
          },
        });
        setErrors((current) => {
          const { [workspaceId]: _removed, ...rest } = current;
          return rest;
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Could not extract palette from image";
        setErrors((current) => ({ ...current, [workspaceId]: message }));
      } finally {
        inflightRef.current.delete(workspaceId);
      }
    },
    [updateWorkspaceTheme],
  );

  useEffect(() => {
    if (!library) {
      return;
    }

    for (const workspace of library.workspaces) {
      if (needsPaletteExtraction(workspace.theme)) {
        void extractForWorkspace(workspace.id, workspace.theme);
      }
    }
  }, [library, extractForWorkspace]);

  return {
    paletteExtractionErrors: errors,
    retryPaletteExtraction: extractForWorkspace,
  };
}
