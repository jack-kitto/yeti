import process from "node:process";
import { describe, expect, it } from "vitest";
import { getLandingPageContent } from "./landing-page";

describe("landing page", () => {
  it("introduces Yeti and links to the home station", () => {
    const content = getLandingPageContent();

    expect(content.productName).toBe("Yeti");
    expect(content.headline.length).toBeGreaterThan(0);
    expect(content.tagline.length).toBeGreaterThan(0);
    expect(content.features).toHaveLength(3);
    expect(content.heroImageSrc).toBe("/landing/hero.png");
    expect(content.homeStationHref).toBe("/home");
    expect(content.homeStationCta).toMatch(/preview/i);
    expect(content.startPageHref).toBe("/start");
    expect(content.earlyAccessNote).toMatch(/local tier/i);
    expect(content.footerGithubHref).toBe("https://github.com/jack-kitto/yeti");
    expect(content.footerContextHref).toContain("CONTEXT.md");
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
