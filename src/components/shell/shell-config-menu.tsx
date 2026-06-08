"use client";

import { useConfigStore } from "@/store/config-store";

type ShellConfigMenuProps = {
  workspaceName: string;
};

const MENU_ITEMS = [
  { section: "links" as const, label: "Links", hint: "Catalog" },
  { section: "edges" as const, label: "Edges", hint: "Groups" },
  { section: "pins" as const, label: "Pins", hint: "Canvas" },
  { section: "library" as const, label: "Library", hint: "Reset" },
];

export function ShellConfigMenu({ workspaceName }: ShellConfigMenuProps) {
  const openSection = useConfigStore((state) => state.openSection);

  return (
    <div className="shell-config-menu">
      <p className="shell-config-menu-title">Settings</p>
      <p className="shell-config-menu-subtitle">{workspaceName}</p>
      <ul className="shell-config-menu-list">
        {MENU_ITEMS.map((item) => (
          <li key={item.section}>
            <button
              type="button"
              className="shell-config-menu-item"
              onClick={() => openSection(item.section)}
            >
              <span className="shell-config-menu-item-label">{item.label}</span>
              <span className="shell-config-menu-item-hint">{item.hint}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
