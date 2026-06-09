import { createDefaultWorkspaceInternalTools } from "@/internal-tools/pomodoro";
import { createDefaultCanvasWidgets } from "@/canvas-widgets/config";
import { rebalanceKeys } from "@/fractional-order/fractional-order";
import type { EdgeGroup, Library, Link, Theme, Workspace } from "./types";

function link(id: string, url: string, title: string): Link {
  return { id, url, title };
}

type EdgeGroupInput = {
  id: string;
  name: string;
  handleIcon?: string;
  links: string[];
};

function orderedLinks(linkIds: string[]): EdgeGroup["links"] {
  const keys = rebalanceKeys(linkIds.length);
  return linkIds.map((linkId, index) => ({
    linkId,
    orderKey: keys[index],
  }));
}

function orderedEdgeGroups(groups: EdgeGroupInput[]): EdgeGroup[] {
  const keys = rebalanceKeys(groups.length);
  return groups.map((group, index) => ({
    id: group.id,
    name: group.name,
    handleIcon: group.handleIcon,
    orderKey: keys[index],
    links: orderedLinks(group.links),
  }));
}

type WorkspacePlacementsInput = {
  left: EdgeGroupInput[];
  top: EdgeGroupInput[];
  bottom: EdgeGroupInput[];
  pins: string[];
};

function workspace(
  id: string,
  name: string,
  theme: Theme,
  placements: WorkspacePlacementsInput,
): Workspace {
  const pinKeys = rebalanceKeys(placements.pins.length);

  return {
    id,
    name,
    theme,
    placements: {
      edges: {
        left: orderedEdgeGroups(placements.left),
        top: orderedEdgeGroups(placements.top),
        bottom: orderedEdgeGroups(placements.bottom),
      },
      pins: placements.pins.map((linkId, index) => ({
        linkId,
        position: { kind: "strip" as const, orderKey: pinKeys[index] },
      })),
    },
    internalTools: createDefaultWorkspaceInternalTools(),
    canvasWidgets: createDefaultCanvasWidgets(),
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

export const STARTER_CATALOG: Link[] = [
  link("github", "https://github.com", "GitHub"),
  link("mdn", "https://developer.mozilla.org", "MDN"),
  link("localhost", "http://localhost:3000", "Localhost"),
  link("railway", "https://railway.app", "Railway"),
  link("vercel", "https://vercel.com", "Vercel"),
  link("npm", "https://www.npmjs.com", "npm"),
  link("docker", "https://www.docker.com", "Docker"),
  link("stackoverflow", "https://stackoverflow.com", "Stack Overflow"),
  link("typescript", "https://www.typescriptlang.org", "TypeScript"),
  link("react", "https://react.dev", "React"),
  link("nextjs", "https://nextjs.org", "Next.js"),
  link("tailwind", "https://tailwindcss.com", "Tailwind CSS"),
  link("figma", "https://www.figma.com", "Figma"),
  link("linear", "https://linear.app", "Linear"),
  link("notion", "https://www.notion.so", "Notion"),
  link("supabase", "https://supabase.com", "Supabase"),
  link("planetscale", "https://planetscale.com", "PlanetScale"),
  link("prisma", "https://www.prisma.io", "Prisma"),
  link("turborepo", "https://turbo.build", "Turborepo"),
  link("bun", "https://bun.sh", "Bun"),
  link("deno", "https://deno.com", "Deno"),
  link("cloudflare", "https://www.cloudflare.com", "Cloudflare"),
  link("fly", "https://fly.io", "Fly.io"),
  link("render", "https://render.com", "Render"),
  link("heroku", "https://www.heroku.com", "Heroku"),
  link("aws", "https://aws.amazon.com", "AWS"),
  link("gcp", "https://cloud.google.com", "Google Cloud"),
  link("stripe", "https://stripe.com", "Stripe"),
  link("sentry", "https://sentry.io", "Sentry"),
  link("datadog", "https://www.datadoghq.com", "Datadog"),
  link("posthog", "https://posthog.com", "PostHog"),
  link("raycast", "https://www.raycast.com", "Raycast"),
  link("arc", "https://arc.net", "Arc Browser"),
  link("obsidian", "https://obsidian.md", "Obsidian"),
  link("hackernews", "https://news.ycombinator.com", "Hacker News"),
  link("reddit", "https://www.reddit.com/r/programming", "r/programming"),
  link("vitest", "https://vitest.dev", "Vitest"),
  link("playwright", "https://playwright.dev", "Playwright"),
  link("storybook", "https://storybook.js.org", "Storybook"),
  link("shadcn", "https://ui.shadcn.com", "shadcn/ui"),
];

export function createStarterLibrary(): Library {
  const catalog = STARTER_CATALOG;

  const work = workspace("work", "Work", workTheme, {
    left: [
      {
        id: "work-dev-tools",
        name: "Dev tools",
        handleIcon: "🛠",
        links: [
          "github",
          "localhost",
          "vercel",
          "npm",
          "docker",
          "typescript",
          "react",
          "nextjs",
          "tailwind",
        ],
      },
      {
        id: "work-docs",
        name: "Docs",
        handleIcon: "📚",
        links: ["mdn", "stackoverflow", "railway"],
      },
      {
        id: "work-product",
        name: "Product",
        handleIcon: "✏️",
        links: ["figma", "linear", "notion"],
      },
      {
        id: "work-backend",
        name: "Backend",
        handleIcon: "🗄",
        links: ["supabase", "planetscale", "prisma", "turborepo", "bun", "deno"],
      },
      {
        id: "work-hosting",
        name: "Hosting",
        handleIcon: "☁️",
        links: ["cloudflare", "fly", "render"],
      },
    ],
    top: [],
    bottom: [],
    pins: ["github", "localhost", "vercel", "linear", "prisma", "sentry"],
  });

  const personal = workspace("personal", "Personal", personalTheme, {
    left: [
      {
        id: "personal-read",
        name: "Read",
        handleIcon: "📰",
        links: ["hackernews", "reddit", "obsidian"],
      },
      {
        id: "personal-tools",
        name: "Tools",
        handleIcon: "🧰",
        links: ["arc", "raycast", "notion", "figma", "storybook", "shadcn"],
      },
      {
        id: "personal-quality",
        name: "Quality",
        handleIcon: "✅",
        links: ["playwright", "vitest", "posthog"],
      },
      {
        id: "personal-learn",
        name: "Learn",
        handleIcon: "📖",
        links: ["github", "mdn", "typescript", "react"],
      },
      {
        id: "personal-ship",
        name: "Ship",
        handleIcon: "🚀",
        links: ["railway", "vercel", "npm", "docker"],
      },
    ],
    top: [],
    bottom: [],
    pins: ["hackernews", "obsidian", "arc", "raycast", "notion"],
  });

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
