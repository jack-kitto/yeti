import type { Library } from "@/library/types";
import { createDefaultFocusRadio } from "./config";

export function ensureLibraryFocusRadio(library: Library): Library {
  if ("focusRadio" in library && library.focusRadio) {
    return library;
  }

  return {
    ...library,
    focusRadio: createDefaultFocusRadio(),
  };
}
