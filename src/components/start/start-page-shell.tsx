"use client";

import Link from "next/link";
import { useState } from "react";
import {
  getStartPageShellContent,
  initialStartPagePhase,
  type StartPagePhase,
} from "@/start/start-page-shell";
import { StartPageCommandBar } from "./start-page-command-bar";

export function StartPageShell() {
  const content = getStartPageShellContent();
  const [phase] = useState<StartPagePhase>(initialStartPagePhase);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      {phase === "loading" ? (
        <p className="text-sm opacity-70" role="status">
          {content.loadingLabel}
        </p>
      ) : null}

      <StartPageCommandBar placeholder={content.commandBarPlaceholder} />

      <footer className="absolute bottom-6 text-xs opacity-50">
        <Link href={content.homeStationHref}>{content.homeStationLinkLabel}</Link>
      </footer>
    </main>
  );
}
