import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Library } from "@/library/types";
import { applyFocusRadioLocalSeed } from "./local-seed";

export function seedFocusRadioFromDisk(
  library: Library,
  cwd = process.cwd(),
): Library {
  const seedPath = resolve(cwd, "yeti-radio.local.yaml");
  if (!existsSync(seedPath)) {
    return library;
  }

  return applyFocusRadioLocalSeed(library, readFileSync(seedPath, "utf8"));
}
