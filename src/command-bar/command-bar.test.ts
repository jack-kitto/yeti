import { describe, expect, it } from "vitest";
import { initialKey } from "@/fractional-order/fractional-order";
import type { Library } from "@/library/types";
import {
  buildCommandBarResults,
  initialCommandBarSelection,
  moveCommandBarSelection,
  shortcutMatchesEvent,
} from "./command-bar";

function makeLibrary(): Library {
  return {
    catalog: [
      { id: "github", url: "https://github.com", title: "GitHub" },
      { id: "penpot", url: "https://penpot.app", title: "Penpot" },
    ],
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
                links: [{ linkId: "github", orderKey: initialKey() }],
              },
            ],
            top: [],
            bottom: [],
          },
          pins: [],
        },
      },
      {
        id: "personal",
        name: "Personal",
        theme: {
          palette: {
            background: "#111",
            surface: "#222",
            text: "#fff",
            accent: "#0f0",
          },
          glassOpacity: 0.7,
          borderRadius: 16,
        },
        placements: {
          edges: { left: [], top: [], bottom: [] },
          pins: [],
        },
      },
    ],
    shortcuts: { focusCommandBar: "Meta+Shift+k", cycleWorkspace: "Control+Tab" },
    activeWorkspaceId: "work",
  };
}

describe("buildCommandBarResults", () => {
  it("lists workspace switches before links in the command bar", () => {
    const results = buildCommandBarResults(makeLibrary(), "pe");

    expect(results.map((result) => result.kind)).toEqual(["workspace", "link"]);
    expect(results[0]).toMatchObject({
      kind: "workspace",
      workspaceId: "personal",
      name: "Personal",
    });
  });
});

describe("moveCommandBarSelection", () => {
  it("cycles the highlighted command bar row with arrow-key directions", () => {
    expect(moveCommandBarSelection(0, "down", 3)).toBe(1);
    expect(moveCommandBarSelection(2, "down", 3)).toBe(0);
    expect(moveCommandBarSelection(0, "up", 3)).toBe(2);
  });
});

describe("initialCommandBarSelection", () => {
  it("selects the first result when results appear", () => {
    expect(initialCommandBarSelection(3)).toBe(0);
    expect(initialCommandBarSelection(0)).toBe(-1);
  });
});

describe("shortcutMatchesEvent", () => {
  it("matches the library focus-command-bar binding", () => {
    const event = {
      key: "k",
      metaKey: true,
      shiftKey: true,
      ctrlKey: false,
      altKey: false,
    } as KeyboardEvent;

    expect(shortcutMatchesEvent(event, "Meta+Shift+k")).toBe(true);
  });
});
