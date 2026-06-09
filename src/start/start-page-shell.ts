import { YETI_ROUTES } from "@/routing/routes";

export type StartPagePhase = "loading" | "ready";

export type StartPageShellContent = {
  loadingLabel: string;
  commandBarPlaceholder: string;
  homeStationHref: string;
  homeStationLinkLabel: string;
};

export function getStartPageShellContent(): StartPageShellContent {
  return {
    loadingLabel: "Loading your library…",
    commandBarPlaceholder: "Search links…",
    homeStationHref: YETI_ROUTES.homeStation,
    homeStationLinkLabel: "Open home station",
  };
}

export function initialStartPagePhase(): StartPagePhase {
  return "loading";
}
