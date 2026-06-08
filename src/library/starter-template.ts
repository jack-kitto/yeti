import type { Library, Link, Theme, Workspace } from "./types";

function link(id: string, url: string, title: string): Link {
  return { id, url, title };
}

type WorkspacePlacementsInput = {
  left: string[];
  top: string[];
  bottom: string[];
  pins: string[];
};

function workspace(
  id: string,
  name: string,
  theme: Theme,
  placements: WorkspacePlacementsInput,
): Workspace {
  return {
    id,
    name,
    theme,
    placements: {
      edges: {
        left: placements.left,
        top: placements.top,
        bottom: placements.bottom,
      },
      pins: placements.pins.map((linkId, order) => ({
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
      "github",
      "mdn",
      "localhost",
      "railway",
      "vercel",
      "npm",
      "docker",
      "stackoverflow",
      "typescript",
      "react",
      "nextjs",
      "tailwind",
    ],
    top: ["figma", "linear", "notion", "supabase", "planetscale", "prisma"],
    bottom: ["turborepo", "bun", "deno", "cloudflare", "fly"],
    pins: ["github", "localhost", "vercel", "linear", "prisma", "sentry"],
  });

  const personal = workspace("personal", "Personal", personalTheme, {
    left: [
      "hackernews",
      "reddit",
      "obsidian",
      "arc",
      "raycast",
      "notion",
      "figma",
      "storybook",
      "shadcn",
      "playwright",
      "vitest",
      "posthog",
    ],
    top: ["github", "mdn", "typescript", "react"],
    bottom: ["railway", "vercel", "npm", "docker"],
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
