"use client";

import { useState } from "react";

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "media", label: "Media" },
  { id: "performance", label: "Performance" },
  { id: "workspaces", label: "Workspaces" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function tabPlaceholder(tab: TabId): string {
  switch (tab) {
    case "dashboard":
      return "Weather, calendar, and at-a-glance widgets will live here.";
    case "media":
      return "Now playing and media controls will live here.";
    case "performance":
      return "CPU, memory, and disk monitors will live here.";
    case "workspaces":
      return "Workspace overview and quick switching will live here.";
  }
}

export function ShellDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  return (
    <div className="shell-dashboard">
      <nav className="shell-dashboard-tabs" aria-label="Control center">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`shell-dashboard-tab${activeTab === tab.id ? " active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="shell-dashboard-body">
        <p className="shell-dashboard-placeholder">{tabPlaceholder(activeTab)}</p>
      </div>
    </div>
  );
}
