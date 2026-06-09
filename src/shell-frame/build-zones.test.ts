import { describe, expect, it } from "vitest";
import { createDefaultCanvasWidgets } from "@/canvas-widgets/config";
import { initialKey } from "@/fractional-order/fractional-order";
import { defaultInternalToolsForTests } from "@/internal-tools/test-fixtures";
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
        internalTools: defaultInternalToolsForTests(),
        canvasWidgets: createDefaultCanvasWidgets(),
      },
    ],
    shortcuts: { focusCommandBar: "Meta+Shift+k", cycleWorkspace: "Control+Tab" },
    activeWorkspaceId: "work",
  };
}

describe("buildShellZones", () => {
  it("does not register a right-rim settings zone", () => {
    const zones = buildShellZones(makeLibrary());

    expect(zones.some((zone) => zone.kind === "config")).toBe(false);
  });

  it("registers pomodoro and tasks on the right rim", () => {
    const zones = buildShellZones(makeLibrary());

    expect(zones.filter((zone) => zone.rim === "right")).toEqual([
      expect.objectContaining({ kind: "internal-tool", id: "__tool_pomodoro__" }),
      expect.objectContaining({ kind: "internal-tool", id: "__tool_tasks__" }),
    ]);
  });
});
