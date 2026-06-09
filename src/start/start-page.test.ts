import { describe, expect, it } from "vitest";
import { getStartPageStubLabel } from "./start-page";

describe("start page stub", () => {
  it("renders a placeholder until the start page shell ships", () => {
    expect(getStartPageStubLabel()).toBe("Start page");
  });
});
