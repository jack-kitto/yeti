import { describe, expect, it } from "vitest";
import { initialKey } from "@/fractional-order/fractional-order";
import type { Library } from "@/library/types";
import { buildShellZones } from "./build-zones";

function makeLibrary(): Library {
  return {
    catalog: [],
    workspaces: [
      {
        id: "work",
        name: "Work",
        theme: {
          palette: {
            background: "#000",
            surface: "#111",
            text: "#fff",
            accent: "#f00",
          },
          glassOpacity: 0.7,
          borderRadius: 16,
        },
        placements: {
          edges: {
            left: [
              {
                id: "left-default",
                name: "Left",
                orderKey: initialKey(),
                links: [],
              },
            ],
            top: [],
            bottom: [],
          },
          pins: [],
        },
      },
    ],
    shortcuts: { focusCommandBar: "Meta+Shift+k", cycleWorkspace: "Control+Tab" },
    activeWorkspaceId: "work",
  };
}

describe("buildShellZones", () => {
  it("does not register a right-rim settings zone", () => {
    const zones = buildShellZones(makeLibrary());

    expect(zones.some((zone) => zone.rim === "right")).toBe(false);
    expect(zones.some((zone) => zone.kind === "config")).toBe(false);
  });
});
