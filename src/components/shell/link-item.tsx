import { resolveLinkImageUrl, resolveLinkTitle } from "@/link-display/link-display";
import type { Link } from "@/library/types";

type LinkItemProps = {
  link: Link;
  showTitle?: boolean;
};

export function LinkItem({ link, showTitle = true }: LinkItemProps) {
  const title = resolveLinkTitle(link);
  const imageUrl = resolveLinkImageUrl(link);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-[var(--qs-border-radius)] px-2 py-1.5 text-sm transition hover:bg-black/5"
      title={title}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          width={20}
          height={20}
          className="rounded-sm"
        />
      ) : (
        <span className="inline-block h-5 w-5 rounded-sm bg-black/10" />
      )}
      {showTitle ? <span className="truncate">{title}</span> : null}
    </a>
  );
}
