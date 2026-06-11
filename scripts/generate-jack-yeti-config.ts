/**
 * One-off generator: reads Arc + Zen browser state and writes a Yeti library snapshot.
 * Run: npx tsx scripts/generate-jack-yeti-config.ts [output-dir]
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import process from "node:process";
import { homedir } from "node:os";
import { join } from "node:path";
import { stringify } from "yaml";
import { createDefaultCanvasWidgets } from "../src/canvas-widgets/config";
import { addFocusRadioStation } from "../src/focus-radio/stations";
import { createStarterFocusRadio } from "../src/focus-radio/starter-stations";
import { rebalanceKeys } from "../src/fractional-order/fractional-order";
import { createDefaultWorkspaceInternalTools } from "../src/internal-tools/pomodoro";
import { LIBRARY_SCHEMA_VERSION } from "../src/library/schema";
import type { EdgeGroup, Library, Link, Theme, Workspace } from "../src/library/types";
import { serializeSnapshot, deserializeSnapshot } from "../src/snapshot/snapshot";
import { getThemePreset } from "../src/theme/theme-presets";

type TabItem = { title: string; url: string };
type FolderItem = { title: string; children: Array<TabItem | FolderItem> };

function themeFromPreset(presetId: Parameters<typeof getThemePreset>[0]): Theme {
  const preset = getThemePreset(presetId)!;
  return {
    ...preset.theme,
    appliedPresetId: presetId,
    appliedThemePresetId: presetId,
    appliedLayoutPresetId: "default",
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function linkIdFor(url: string, title: string, used: Set<string>): string {
  let base = slugify(new URL(url).hostname || title);
  if (!base) base = "link";
  let id = base;
  let n = 2;
  while (used.has(id)) {
    id = `${base}-${n}`;
    n++;
  }
  used.add(id);
  return id;
}

function orderedLinks(linkIds: string[]): EdgeGroup["links"] {
  const keys = rebalanceKeys(linkIds.length);
  return linkIds.map((linkId, index) => ({ linkId, orderKey: keys[index]! }));
}

function orderedEdgeGroups(
  groups: Array<{ id: string; name: string; handleIcon?: string; links: string[] }>,
): EdgeGroup[] {
  const keys = rebalanceKeys(groups.length);
  return groups.map((group, index) => ({
    id: group.id,
    name: group.name,
    handleIcon: group.handleIcon,
    orderKey: keys[index]!,
    links: orderedLinks(group.links),
  }));
}

function workspace(
  id: string,
  name: string,
  theme: Theme,
  left: Array<{ id: string; name: string; handleIcon?: string; links: string[] }>,
): Workspace {
  return {
    id,
    name,
    theme,
    placements: {
      edges: {
        left: orderedEdgeGroups(left),
        top: [],
        bottom: [],
      },
    },
    internalTools: createDefaultWorkspaceInternalTools(),
    canvasWidgets: createDefaultCanvasWidgets(),
  };
}

function parseArcSidebar(path: string) {
  const data = JSON.parse(readFileSync(path, "utf8")) as {
    sidebar: { containers: Array<{ items: unknown[]; spaces: unknown[] }> };
  };
  const container = data.sidebar.containers[1]!;
  const rawItems = container.items;
  const spacesRaw = container.spaces;

  const byId = new Map<string, Record<string, unknown>>();
  for (let i = 0; i < rawItems.length; i++) {
    const id = rawItems[i];
    const item = rawItems[i + 1];
    if (typeof id === "string" && item && typeof item === "object") {
      byId.set(id, item as Record<string, unknown>);
      i++;
    }
  }

  const children = new Map<string, string[]>();
  for (const [itemId, item] of byId) {
    const parent = item.parentID;
    if (typeof parent === "string") {
      const list = children.get(parent) ?? [];
      list.push(itemId);
      children.set(parent, list);
    }
  }

  function getStructure(parentId: string): Array<TabItem | FolderItem> {
    const result: Array<TabItem | FolderItem> = [];
    for (const childId of children.get(parentId) ?? []) {
      const item = byId.get(childId);
      if (!item) continue;
      const dataField = item.data as Record<string, unknown> | undefined;
      const title = typeof item.title === "string" ? item.title : undefined;
      if (dataField?.tab) {
        const tab = dataField.tab as Record<string, unknown>;
        const url = tab.savedURL;
        if (typeof url === "string") {
          result.push({
            title: title ?? (typeof tab.savedTitle === "string" ? tab.savedTitle : url),
            url,
          });
        }
      } else if (dataField?.list) {
        const nested = getStructure(childId);
        if (nested.length > 0 && title) {
          result.push({ title, children: nested });
        }
      }
    }
    return result;
  }

  const spaces: Array<{ title: string; pinnedContainer: string }> = [];
  const seen = new Set<string>();
  for (const entry of spacesRaw) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    const id = record.id;
    const title = record.title;
    const containerIds = record.containerIDs;
    if (typeof id !== "string" || typeof title !== "string" || !Array.isArray(containerIds)) {
      continue;
    }
    if (seen.has(id) || title === "Personal") continue;
    seen.add(id);
    const pinned = containerIds[1];
    if (typeof pinned !== "string") continue;
    spaces.push({ title, pinnedContainer: pinned });
  }

  // Default Arc Home profile (folders: Github, Music, Resources, kitto.sh, …)
  spaces.unshift({
    title: "Home",
    pinnedContainer: "thebrowser.company.defaultPersonalSpacePinnedContainerID",
  });

  return spaces.map((space) => ({
    name: space.title,
    structure: getStructure(space.pinnedContainer),
  }));
}

function readZenSessions(path: string) {
  const script = `
import json, lz4.block, sys
path = sys.argv[1]
with open(path, 'rb') as f:
    data = lz4.block.decompress(f.read()[8:])
print(data.decode('utf-8'))
`;
  const pythonCandidates = [
    "/tmp/zenparse/bin/python3",
    "python3",
    "python",
  ];
  let raw: string | undefined;
  for (const python of pythonCandidates) {
    try {
      raw = execFileSync(python, ["-c", script, path], { encoding: "utf8" });
      break;
    } catch {
      // try next python
    }
  }
  if (!raw) {
    const fallback = "/tmp/zen-sessions.json";
    try {
      raw = readFileSync(fallback, "utf8");
    } catch {
      throw new Error(
        "Could not read Zen sessions. Install lz4 in python or write /tmp/zen-sessions.json",
      );
    }
  }
  const sessions = JSON.parse(raw) as {
    spaces: Array<{ uuid: string; name: string }>;
    tabs: Array<{
      zenWorkspace?: string | null;
      pinned?: boolean;
      entries?: Array<{ url?: string; title?: string }>;
    }>;
  };

  const names = new Map(sessions.spaces.map((space) => [space.uuid, space.name]));
  const byWorkspace = new Map<string, TabItem[]>();

  for (const tab of sessions.tabs) {
    const workspaceId = tab.zenWorkspace;
    if (!workspaceId) continue;
    const entry = tab.entries?.at(-1);
    const url = entry?.url;
    if (!url || url.startsWith("about:")) continue;
    const list = byWorkspace.get(workspaceId) ?? [];
    list.push({ title: entry.title ?? url, url });
    byWorkspace.set(workspaceId, list);
  }

  return [...names.entries()].map(([id, name]) => ({
    name,
    tabs: byWorkspace.get(id) ?? [],
  }));
}

function flattenStructure(
  structure: Array<TabItem | FolderItem>,
  catalog: Map<string, Link>,
  usedIds: Set<string>,
): Array<{ id: string; name: string; handleIcon?: string; links: string[] }> {
  const groups: Array<{ id: string; name: string; handleIcon?: string; links: string[] }> = [];

  for (const item of structure) {
    if ("url" in item) {
      const id = linkIdFor(item.url, item.title, usedIds);
      catalog.set(id, { id, url: item.url, title: item.title });
      groups.push({ id: slugify(item.title) || id, name: item.title, links: [id] });
      continue;
    }

    const linkIds: string[] = [];
    function collect(node: TabItem | FolderItem) {
      if ("url" in node) {
        const id = linkIdFor(node.url, node.title, usedIds);
        catalog.set(id, { id, url: node.url, title: node.title });
        linkIds.push(id);
        return;
      }
      for (const child of node.children) collect(child);
    }
    for (const child of item.children) collect(child);
    if (linkIds.length > 0) {
      groups.push({
        id: slugify(item.title) || "group",
        name: item.title,
        links: linkIds,
      });
    }
  }

  return groups;
}

function tabsToGroups(
  tabs: TabItem[],
  catalog: Map<string, Link>,
  usedIds: Set<string>,
  groupName: string,
  icon?: string,
) {
  const linkIds = tabs.map((tab) => {
    const id = linkIdFor(tab.url, tab.title, usedIds);
    catalog.set(id, { id, url: tab.url, title: tab.title });
    return id;
  });
  if (linkIds.length === 0) return [];
  return [{ id: slugify(groupName), name: groupName, handleIcon: icon, links: linkIds }];
}

function buildLibrary(): Library {
  const arcPath = join(homedir(), "Library/Application Support/Arc/StorableSidebar.json");
  const zenPath = join(
    homedir(),
    "Library/Application Support/zen/Profiles/d33n5hxn.Default (release)/zen-sessions.jsonlz4",
  );

  const arcSpaces = parseArcSidebar(arcPath);
  const zenSpaces = readZenSessions(zenPath);
  const catalog = new Map<string, Link>();
  const usedIds = new Set<string>();
  const workspaces: Workspace[] = [];

  const homeArc = arcSpaces.find((space) => space.name === "Home");
  const homeZen = zenSpaces.find((space) => space.name === "Home");
  const homeGroups = [
    ...flattenStructure(homeArc?.structure ?? [], catalog, usedIds),
    ...tabsToGroups(homeZen?.tabs ?? [], catalog, usedIds, "Zen tabs", "🧘"),
  ];
  workspaces.push(workspace("home", "Home", themeFromPreset("personal"), homeGroups));

  const delvArc = arcSpaces.find((space) => space.name === "Delv");
  const delvZen = zenSpaces.find((space) => space.name === "Delv");
  workspaces.push(
    workspace("delv", "Delv", themeFromPreset("work"), [
      ...flattenStructure(delvArc?.structure ?? [], catalog, usedIds),
      ...tabsToGroups(delvZen?.tabs ?? [], catalog, usedIds, "Zen tabs", "🧘"),
    ]),
  );

  const nodArc = arcSpaces.find((space) => space.name === "Nod");
  workspaces.push(
    workspace("nod", "Nod", themeFromPreset("ocean"), flattenStructure(nodArc?.structure ?? [], catalog, usedIds)),
  );

  const encryptArc = arcSpaces.find((space) => space.name === "Encryptsim");
  const encryptZen = zenSpaces.find((space) => space.name === "encryptSIM");
  workspaces.push(
    workspace("encryptsim", "encryptSIM", themeFromPreset("forest"), [
      ...flattenStructure(encryptArc?.structure ?? [], catalog, usedIds),
      ...tabsToGroups(encryptZen?.tabs ?? [], catalog, usedIds, "Zen tabs", "🧘"),
    ]),
  );

  const evoArc = arcSpaces.find((space) => space.name === "evolutioned");
  workspaces.push(
    workspace(
      "evolutioned",
      "evolutioned",
      themeFromPreset("sunset"),
      flattenStructure(evoArc?.structure ?? [], catalog, usedIds),
    ),
  );

  const essentials: TabItem[] = [
    { title: "Discord", url: "https://discord.com/" },
    { title: "GitHub", url: "https://github.com/" },
    { title: "Notion", url: "https://notion.com/" },
  ];
  const essentialsGroups = tabsToGroups(essentials, catalog, usedIds, "Essentials", "⭐");
  if (workspaces[0] && essentialsGroups.length > 0) {
    workspaces[0] = {
      ...workspaces[0],
      placements: {
        ...workspaces[0].placements,
        edges: {
          ...workspaces[0].placements.edges,
          left: [...orderedEdgeGroups(essentialsGroups), ...workspaces[0].placements.edges.left],
        },
      },
    };
  }

  const stations = [
    {
      label: "Groove Salad",
      kind: "stream" as const,
      url: "https://ice5.somafm.com/groovesalad-128-mp3",
      description: "A nicely chilled plate of ambient/downtempo beats and grooves.",
      imageUrl: "https://somafm.com/logos/256/groovesalad256.png",
      favorite: true,
    },
    {
      label: "Fluid",
      kind: "stream" as const,
      url: "https://ice5.somafm.com/fluid-128-mp3",
      description: "Instrumental hiphop, future soul and liquid trap.",
      imageUrl: "https://somafm.com/logos/256/fluid256.jpg",
      favorite: true,
    },
    {
      label: "Drone Zone",
      kind: "stream" as const,
      url: "https://ice5.somafm.com/dronezone-128-mp3",
      description: "Atmospheric textures with minimal beats.",
      imageUrl: "https://somafm.com/logos/256/dronezone256.png",
      favorite: true,
    },
    {
      label: "Techno.FM",
      kind: "stream" as const,
      url: "https://stream.techno.fm/radio1.mp3",
      description: "Techno.FM radio stream.",
      favorite: true,
    },
    {
      label: "synthwave radio",
      kind: "youtube" as const,
      url: "https://www.youtube.com/watch?v=4xDzrJKXOOY",
      favorite: true,
    },
    {
      label: "lofi hip hop radio",
      kind: "youtube" as const,
      url: "https://www.youtube.com/watch?v=X4VbdwhkE10",
      favorite: true,
    },
    {
      label: "Art of Minimal Techno",
      kind: "youtube" as const,
      url: "https://www.youtube.com/watch?v=UYOb37KRFqk",
      favorite: true,
    },
    {
      label: "Deep Focus Music",
      kind: "youtube" as const,
      url: "https://www.youtube.com/watch?v=LhMyAYil3N8&list=RDLhMyAYil3N8&start_radio=1",
      favorite: true,
    },
  ];

  let library: Library = {
    schemaVersion: LIBRARY_SCHEMA_VERSION,
    catalog: [...catalog.values()],
    workspaces,
    shortcuts: {
      focusCommandBar: "Meta+Shift+k",
      cycleWorkspace: "Control+Tab",
    },
    focusRadio: createStarterFocusRadio(),
    activeWorkspaceId: "home",
  };

  for (const station of stations) {
    library = addFocusRadioStation(library, station);
  }

  return library;
}

const outputDir = process.argv[2] ?? join(homedir(), "code/yeti-config");
mkdirSync(outputDir, { recursive: true });

const library = buildLibrary();
const yaml = serializeSnapshot(library);
deserializeSnapshot(yaml);

writeFileSync(join(outputDir, "library.yaml"), yaml);

const radioYaml = stringify({
  stations: library.focusRadio.stations.map((station) => ({
    label: station.label,
    kind: station.kind,
    url: station.url,
    ...(station.description ? { description: station.description } : {}),
    ...(station.imageUrl ? { imageUrl: station.imageUrl } : {}),
    ...(station.favorite ? { favorite: true } : {}),
  })),
});

writeFileSync(join(outputDir, "yeti-radio.yaml"), radioYaml);

const readme = `# yeti-config

Personal Yeti library snapshot generated from Arc and Zen browser workspaces.

## Import

In Yeti settings → Library → Import snapshot URL:

\`\`\`
https://raw.githubusercontent.com/jack-kitto/yeti-config/main/library.yaml
\`\`\`

## Contents

Workspaces (from browser profiles):

| Workspace | Source |
|-----------|--------|
| Home | Arc Home + Zen Home |
| Delv | Arc Delv + Zen Delv |
| Nod | Arc Nod |
| encryptSIM | Arc Encryptsim + Zen encryptSIM |
| evolutioned | Arc evolutioned |

Focus radio stations are in \`yeti-radio.yaml\` (also embedded in \`library.yaml\`).

## Regenerate

\`\`\`bash
python3 -m venv /tmp/zenparse && /tmp/zenparse/bin/pip install lz4
npx tsx scripts/generate-jack-yeti-config.ts /path/to/yeti-config
\`\`\`

Generated: ${new Date().toISOString().slice(0, 10)}
`;

writeFileSync(join(outputDir, "README.md"), readme);

console.log(`Wrote ${outputDir}/library.yaml (${library.catalog.length} links, ${library.workspaces.length} workspaces)`);
console.log(`Wrote ${outputDir}/yeti-radio.yaml (${library.focusRadio.stations.length} stations)`);
