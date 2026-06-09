import Link from "next/link";
import { getLandingPageContent } from "@/landing/landing-page";

export function LandingPage() {
  const { productName, tagline, homeStationHref, homeStationCta } =
    getLandingPageContent();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">{productName}</h1>
      <p className="max-w-md text-sm opacity-70">{tagline}</p>
      <Link
        href={homeStationHref}
        className="rounded-lg bg-[color:var(--qs-color-accent)] px-4 py-2 text-sm font-medium text-[color:var(--qs-color-on-accent)]"
      >
        {homeStationCta}
      </Link>
    </main>
  );
}
