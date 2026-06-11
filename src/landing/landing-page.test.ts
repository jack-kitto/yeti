import process from "node:process";
import { describe, expect, it } from "vitest";
import { getLandingPageContent } from "./landing-page";

describe("landing page", () => {
  it("introduces Yeti and links to the home station", () => {
    const content = getLandingPageContent();

    expect(content.productName).toBe("Yeti");
    expect(content.headline).toMatch(/start page/i);
    expect(content.headline).not.toMatch(/shell|riced/i);
    expect(content.tagline).not.toMatch(/rim/i);
    expect(content.tagline.length).toBeGreaterThan(0);
    expect(content.features).toHaveLength(3);
    expect(content.features.every((feature) => !/rim/i.test(feature.description))).toBe(true);
    expect(content.heroImageSrc).toBe("/landing/hero.png");
    expect(content.heroImageAlt).not.toMatch(/rim/i);
    expect(content.homeStationHref).toBe("/home");
    expect(content.homeStationCta).toMatch(/preview/i);
    expect(content.startPageHref).toBe("/start");
    expect(content.earlyAccessNote).toMatch(/local tier/i);
    expect(content.setupLinks.some((link) => link.label.match(/example config/i))).toBe(true);
    expect(content.setupLinks.some((link) => link.label.match(/chrome extension/i))).toBe(true);
    expect(content.setupLinks.some((link) => link.label.match(/firefox extension/i))).toBe(true);
    expect(content.setupLinks.some((link) => link.label.match(/import skills/i))).toBe(true);
    expect(content.footerLinks.some((link) => link.href === "/llms.txt")).toBe(true);
    expect(content.footerLinks.some((link) => link.href.includes("github.com/jack-kitto/yeti"))).toBe(
      true,
    );
    expect(content.footerLinks.some((link) => link.href.includes("CONTEXT.md"))).toBe(false);
  });

  it("hides the waitlist CTA when NEXT_PUBLIC_WAITLIST_URL is unset", () => {
    const previous = process.env.NEXT_PUBLIC_WAITLIST_URL;
    delete process.env.NEXT_PUBLIC_WAITLIST_URL;

    try {
      expect(getLandingPageContent().waitlistHref).toBeNull();
    } finally {
      if (previous === undefined) {
        delete process.env.NEXT_PUBLIC_WAITLIST_URL;
      } else {
        process.env.NEXT_PUBLIC_WAITLIST_URL = previous;
      }
    }
  });

  it("shows the waitlist CTA when NEXT_PUBLIC_WAITLIST_URL is set", () => {
    const previous = process.env.NEXT_PUBLIC_WAITLIST_URL;
    process.env.NEXT_PUBLIC_WAITLIST_URL = "https://tally.so/r/example";

    try {
      const content = getLandingPageContent();
      expect(content.waitlistHref).toBe("https://tally.so/r/example");
      expect(content.waitlistCta).toMatch(/waitlist/i);
    } finally {
      if (previous === undefined) {
        delete process.env.NEXT_PUBLIC_WAITLIST_URL;
      } else {
        process.env.NEXT_PUBLIC_WAITLIST_URL = previous;
      }
    }
  });
});
