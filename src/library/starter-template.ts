import type { Library, Link, Theme, Workspace } from "./types";

function link(id: string, url: string, title: string): Link {
  return { id, url, title };
}

function workspace(
  id: string,
  name: string,
  theme: Theme,
  linkIds: string[],
): Workspace {
  const [first, second, third, fourth, fifth, sixth] = linkIds;

  return {
    id,
    name,
    theme,
    placements: {
      edges: {
        left: [first, second, third].filter(Boolean) as string[],
        top: [fourth, fifth].filter(Boolean) as string[],
        bottom: [sixth, first].filter(Boolean) as string[],
      },
      pins: linkIds.slice(0, 4).map((linkId, order) => ({
        linkId,
        position: { kind: "strip" as const, order },
      })),
    },
  };
}

const workTheme: Theme = {
  palette: {
    background: "#f5f0e8",
    surface: "#fffdf9",
    text: "#2c2419",
    accent: "#c17f59",
  },
  backgroundUrl:
    "https://images.unsplash.com/photo-1497215728101-856f1ea4214f?w=1920",
  glassOpacity: 0.72,
  borderRadius: 20,
};

const personalTheme: Theme = {
  palette: {
    background: "#1a1d24",
    surface: "#252a33",
    text: "#e8e6e3",
    accent: "#7eb8da",
  },
  backgroundUrl:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920",
  glassOpacity: 0.65,
  borderRadius: 20,
};

export function createStarterLibrary(): Library {
  const catalog: Link[] = [
    link("github", "https://github.com", "GitHub"),
    link("mdn", "https://developer.mozilla.org", "MDN"),
    link("localhost", "http://localhost:3000", "Localhost"),
    link("railway", "https://railway.app", "Railway"),
    link("vercel", "https://vercel.com", "Vercel"),
    link("npm", "https://www.npmjs.com", "npm"),
  ];

  const work = workspace("work", "Work", workTheme, catalog.map((l) => l.id));
  const personal = workspace(
    "personal",
    "Personal",
    personalTheme,
    catalog.map((l) => l.id),
  );

  return {
    catalog,
    workspaces: [work, personal],
    shortcuts: {
      focusCommandBar: "Meta+Shift+k",
      cycleWorkspace: "Control+Tab",
    },
    activeWorkspaceId: work.id,
  };
}
