import { PRODUCT_NAME } from "@/branding/branding";
import { YETI_ROUTES } from "@/routing/routes";

export type LandingFeature = {
  title: string;
  description: string;
};

export type LandingPageContent = {
  productName: string;
  headline: string;
  tagline: string;
  features: LandingFeature[];
  heroImageSrc: string;
  heroImageAlt: string;
  homeStationHref: string;
  homeStationCta: string;
  startPageHref: string;
  startPageCta: string;
  waitlistHref: string | null;
  waitlistCta: string;
  earlyAccessNote: string;
};

export function getLandingPageContent(): LandingPageContent {
  const waitlistHref = process.env.NEXT_PUBLIC_WAITLIST_URL?.trim() || null;

  return {
    productName: PRODUCT_NAME,
    headline: "A riced desktop shell in your browser",
    tagline:
      "Pin one tab. Links on the rim, calm canvas to lock in. Your workspace travels with you — no browser extension, no new browser.",
    features: [
      {
        title: "Browser-agnostic",
        description:
          "What you liked about Arc or Zen, without switching browsers. A start page you own — local-first, portable like dotfiles.",
      },
      {
        title: "Spatial shell",
        description:
          "Edge link clusters, command bar search, focus tools on the rim. Inspired by linux rice — a pale imitation, still cool.",
      },
      {
        title: "Dev workstation tab",
        description:
          "Tasks, estimates, and timeboxes in one pinned tab. Export your library as YAML; restore from GitHub when you switch machines.",
      },
    ],
    heroImageSrc: "/landing/hero.png",
    heroImageAlt: "Yeti home station with edge notch flyout open on the left rim",
    homeStationHref: YETI_ROUTES.homeStation,
    homeStationCta: "Try the preview",
    startPageHref: YETI_ROUTES.startPage,
    startPageCta: "Open start page",
    waitlistHref,
    waitlistCta: "Join the waitlist",
    earlyAccessNote:
      "Public preview — local tier only. Cloud library sync coming later. Your data stays in this browser until you export.",
  };
}
