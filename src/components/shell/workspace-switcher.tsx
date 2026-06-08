"use client";

import type { Library } from "@/library/types";

type WorkspaceSwitcherProps = {
  library: Library;
  onSwitch: (workspaceId: string) => void;
};

export function WorkspaceSwitcher({
  library,
  onSwitch,
}: WorkspaceSwitcherProps) {
  return (
    <div className="flex gap-2 rounded-full bg-[color:var(--qs-color-surface)]/80 p-1 shadow-sm backdrop-blur-md">
      {library.workspaces.map((workspace) => {
        const active = workspace.id === library.activeWorkspaceId;

        return (
          <button
            key={workspace.id}
            type="button"
            onClick={() => onSwitch(workspace.id)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              active
                ? "bg-[color:var(--qs-color-accent)] text-white"
                : "text-[color:var(--qs-color-text)] hover:bg-black/5"
            }`}
          >
            {workspace.name}
          </button>
        );
      })}
    </div>
  );
}
