import { describe, expect, it } from "vitest";
import { getLandingPageContent } from "./landing-page";

describe("landing page", () => {
  it("introduces Yeti and links to the home station", () => {
    const content = getLandingPageContent();

    expect(content.productName).toBe("Yeti");
    expect(content.tagline.length).toBeGreaterThan(0);
    expect(content.homeStationHref).toBe("/home");
    expect(content.homeStationCta).toMatch(/home station/i);
  });
});
