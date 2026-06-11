import { BRAND_CREAM, BRAND_DARK, LOGO_CONTAINER_RX, LOGO_MARK_PATH, LOGO_VIEWBOX_SIZE } from "@/branding/logo-mark";
import { PRODUCT_NAME } from "@/branding/branding";

type YetiLogoProps = {
  size?: number;
  lockup?: boolean;
  animated?: boolean;
  className?: string;
  label?: string;
};

export function YetiLogo({
  size = 32,
  lockup = false,
  animated = false,
  className,
  label = PRODUCT_NAME,
}: YetiLogoProps) {
  const icon = (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${LOGO_VIEWBOX_SIZE} ${LOGO_VIEWBOX_SIZE}`}
      fill="none"
      aria-hidden={lockup ? true : undefined}
      aria-label={lockup ? undefined : label}
      role={lockup ? undefined : "img"}
      className={animated ? "yeti-logo--animated" : undefined}
    >
      <rect width={LOGO_VIEWBOX_SIZE} height={LOGO_VIEWBOX_SIZE} rx={LOGO_CONTAINER_RX} fill={BRAND_DARK} />
      <path fill={BRAND_CREAM} fillRule="evenodd" d={LOGO_MARK_PATH} />
    </svg>
  );

  if (!lockup) {
    return <span className={className}>{icon}</span>;
  }

  return (
    <span className={["yeti-logo-lockup", className].filter(Boolean).join(" ")} aria-label={label}>
      {icon}
      <span className="yeti-logo-lockup-label" aria-hidden="true">
        {label}
      </span>
    </span>
  );
}
