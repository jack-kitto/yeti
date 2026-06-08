import { resolvePins } from "@/placement/placement";
import type { Library } from "@/library/types";
import { LinkItem } from "./link-item";

type PinStripProps = {
  library: Library;
};

export function PinStrip({ library }: PinStripProps) {
  const pins = resolvePins(library);

  if (pins.length === 0) {
    return null;
  }

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-1 rounded-[var(--qs-border-radius)] border border-white/20 bg-[color:var(--qs-color-surface)]/80 px-3 py-2 shadow-sm backdrop-blur-sm"
      aria-label="Pin strip"
    >
      {pins.map((link) => (
        <LinkItem key={link.id} link={link} showTitle={false} />
      ))}
    </div>
  );
}
