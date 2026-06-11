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
  });
});
