import process from "node:process";
import { PRODUCT_NAME } from "@/branding/branding";
import { YETI_ROUTES } from "@/routing/routes";

export type LandingFeature = {
  title: string;
  description: string;
};

export type LandingLink = {
  href: string;
  label: string;
};

export type LandingPageContent = {
  productName: string;
  headline: string;
  tagline: string;
  features: LandingFeature[];
  setupTitle: string;
  setupDescription: string;
  setupLinks: LandingLink[];
  heroImageSrc: string;
  heroImageAlt: string;
  homeStationHref: string;
  homeStationCta: string;
  startPageHref: string;
  startPageCta: string;
  waitlistHref: string | null;
  waitlistCta: string;
  earlyAccessNote: string;
  footerLinks: LandingLink[];
  footerLocalTierNote: string;
};

const EXAMPLE_CONFIG_REPO_HREF = "https://github.com/jack-kitto/yeti-config";
const MAIN_REPO_HREF = "https://github.com/jack-kitto/yeti";

export function getLandingPageContent(): LandingPageContent {
  const waitlistHref = process.env.NEXT_PUBLIC_WAITLIST_URL?.trim() || null;

  return {
    productName: PRODUCT_NAME,
    headline: "Make any browser your home",
    tagline:
      "You don't need all your bookmarks stuck inside one browser. Access any link with a few keystrokes—or explore and open pinned tabs through a quickshell that puts bookmarks right where you need them.",
    features: [
      {
        title: "Any browser",
        description:
          "Keep Chrome, Firefox, or Safari. Pin Yeti as your home station and set the start page as your new tab—your library is yours, not locked to one vendor.",
      },
      {
        title: "Keystrokes first",
        description:
          "The command bar finds links, workspaces, and actions instantly. Less hunting through bookmark bars and more opening what you need.",
      },
      {
        title: "Bookmarks at the edge",
        description:
          "Named clusters at the screen edge open into flyouts—spatial navigation inspired by Quickshell rice, without switching browsers.",
      },
    ],
    setupTitle: "Bring your bookmarks",
    setupDescription:
      "Fork the example config, sideload the optional new-tab extension, or use Claude skills to import from Chrome, Firefox, or Arc.",
    setupLinks: [
      {
        label: "Example config repo",
        href: EXAMPLE_CONFIG_REPO_HREF,
      },
      {
        label: "Chrome extension",
        href: MAIN_REPO_HREF,
      },
      {
        label: "Firefox extension",
        href: MAIN_REPO_HREF,
      },
      {
        label: "Import skills & scripts",
        href: EXAMPLE_CONFIG_REPO_HREF,
      },
    ],
    heroImageSrc: "/landing/hero.png",
    heroImageAlt: "Yeti home station with a left edge bookmark flyout open",
    homeStationHref: YETI_ROUTES.homeStation,
    homeStationCta: "Try the preview",
    startPageHref: YETI_ROUTES.startPage,
    startPageCta: "Open start page",
    waitlistHref,
    waitlistCta: "Join the waitlist",
    earlyAccessNote:
      "Public preview — local tier only. Cloud library sync coming later. Your data stays in this browser until you export.",
    footerLinks: [
      {
        label: "View source on GitHub",
        href: MAIN_REPO_HREF,
      },
      {
        label: "llms.txt",
        href: "/llms.txt",
      },
    ],
    footerLocalTierNote:
      "Local tier — your library stays in this browser until you export a snapshot.",
  };
}
