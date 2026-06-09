import { PRODUCT_NAME } from "@/branding/branding";
import { YETI_ROUTES } from "@/routing/routes";

export type LandingPageContent = {
  productName: string;
  tagline: string;
  homeStationHref: string;
  homeStationCta: string;
};

export function getLandingPageContent(): LandingPageContent {
  return {
    productName: PRODUCT_NAME,
    tagline:
      "A developer-focused productivity shell — bookmarks, workspaces, and spatial navigation in one pinned tab.",
    homeStationHref: YETI_ROUTES.homeStation,
    homeStationCta: "Open home station",
  };
}
