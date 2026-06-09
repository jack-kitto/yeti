import { resolveLinkTitle } from "@/link-display/link-display";
import type { Library } from "@/library/types";
import { searchLinks, searchWorkspaces } from "@/search/search";

export type CommandBarWorkspaceResult = {
  kind: "workspace";
  workspaceId: string;
  name: string;
};

export type CommandBarLinkResult = {
  kind: "link";
  linkId: string;
  url: string;
  title: string;
  source: "workspace" | "catalog";
};

export type CommandBarActionResult = {
  kind: "action";
  actionId: "reset" | "settings";
  label: string;
};

export type CommandBarResult =
  | CommandBarWorkspaceResult
  | CommandBarLinkResult
  | CommandBarActionResult;

export function isCommandBarActionMode(query: string): boolean {
  return query.startsWith(":");
}

const COMMAND_BAR_ACTIONS: CommandBarActionResult[] = [
  {
    kind: "action",
    actionId: "settings",
    label: "Open settings",
  },
  {
    kind: "action",
    actionId: "reset",
    label: "Reset to starter template",
  },
];

export function buildCommandBarActionResults(query: string): CommandBarActionResult[] {
  const actionQuery = query.slice(1).trim().toLowerCase();
  if (!actionQuery) {
    return COMMAND_BAR_ACTIONS;
  }

  return COMMAND_BAR_ACTIONS.filter((action) => {
    const haystack = `${action.actionId} ${action.label}`.toLowerCase();
    let queryIndex = 0;
    for (let i = 0; i < haystack.length && queryIndex < actionQuery.length; i++) {
      if (haystack[i] === actionQuery[queryIndex]) {
        queryIndex++;
      }
    }
    return queryIndex === actionQuery.length;
  });
}

export function buildCommandBarRows(
  library: Library,
  query: string,
): CommandBarResult[] {
  if (isCommandBarActionMode(query)) {
    return buildCommandBarActionResults(query);
  }

  return buildCommandBarResults(library, query);
}

export function buildCommandBarResults(
  library: Library,
  query: string,
): CommandBarResult[] {
  const workspaceResults: CommandBarWorkspaceResult[] = searchWorkspaces(
    library,
    query,
  ).map((workspace) => ({
    kind: "workspace",
    workspaceId: workspace.id,
    name: workspace.name,
  }));

  const linkResults: CommandBarLinkResult[] = searchLinks(library, query).map(
    ({ link, source }) => ({
      kind: "link",
      linkId: link.id,
      url: link.url,
      title: resolveLinkTitle(link),
      source,
    }),
  );

  return [...workspaceResults, ...linkResults];
}

export function initialCommandBarSelection(resultCount: number): number {
  return resultCount > 0 ? 0 : -1;
}

export function moveCommandBarSelection(
  currentIndex: number,
  direction: "up" | "down",
  resultCount: number,
): number {
  if (resultCount === 0) {
    return -1;
  }

  if (direction === "down") {
    return (currentIndex + 1) % resultCount;
  }

  return (currentIndex - 1 + resultCount) % resultCount;
}

export function resolveCommandBarListNavigation(
  key: string,
  shiftKey: boolean,
): "up" | "down" | null {
  if (key === "ArrowDown") {
    return "down";
  }
  if (key === "ArrowUp") {
    return "up";
  }
  if (key === "Tab") {
    return shiftKey ? "up" : "down";
  }
  return null;
}

export function shouldCaptureTypeToFocusKey(
  event: Pick<KeyboardEvent, "key" | "ctrlKey" | "metaKey" | "altKey">,
): boolean {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return false;
  }
  return event.key.length === 1;
}

export function isTextEntryElement(element: Element | null): boolean {
  if (!element) {
    return false;
  }
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    return true;
  }
  return element instanceof HTMLElement && element.isContentEditable;
}

const SHORTCUT_ALIASES: Record<string, string> = {
  Ctrl: "Control",
  Command: "Meta",
  Cmd: "Meta",
  Option: "Alt",
};

function normalizeShortcutPart(part: string): string {
  return SHORTCUT_ALIASES[part] ?? part;
}

/** Match a library shortcut binding like `Meta+Shift+k` against a keydown event. */
export function shortcutMatchesEvent(
  event: Pick<KeyboardEvent, "key" | "metaKey" | "shiftKey" | "ctrlKey" | "altKey">,
  binding: string,
): boolean {
  const parts = binding.split("+").map((part) => normalizeShortcutPart(part.trim()));
  const keyPart = parts[parts.length - 1].toLowerCase();
  const modifiers = new Set(parts.slice(0, -1));

  return (
    event.key.toLowerCase() === keyPart &&
    event.metaKey === modifiers.has("Meta") &&
    event.shiftKey === modifiers.has("Shift") &&
    event.ctrlKey === modifiers.has("Control") &&
    event.altKey === modifiers.has("Alt")
  );
}
