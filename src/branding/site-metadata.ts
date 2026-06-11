import type { Metadata } from "next";
import { PRODUCT_NAME } from "@/branding/branding";

export const siteMetadata: Metadata = {
  title: `${PRODUCT_NAME} — browser home station`,
  description:
    "A riced desktop shell in your browser. Links on the rim, calm canvas to lock in. Local-first, portable like dotfiles.",
  icons: {
    icon: "/favicon.svg",
  },
};
