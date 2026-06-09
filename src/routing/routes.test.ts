import { describe, expect, it } from "vitest";
import { YETI_ROUTES } from "./routes";

describe("Yeti routes", () => {
  it("exposes landing, home station, and start page paths", () => {
    expect(YETI_ROUTES.landing).toBe("/");
    expect(YETI_ROUTES.homeStation).toBe("/home");
    expect(YETI_ROUTES.startPage).toBe("/start");
  });
});
