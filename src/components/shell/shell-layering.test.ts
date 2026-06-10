import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("shell canvas layering", () => {
  const css = readFileSync(resolve(__dirname, "../../app/globals.css"), "utf8");
  const shellSource = readFileSync(resolve(__dirname, "./shell.tsx"), "utf8");

  it("keeps canvas widgets above shell surface effects but below edge chrome", () => {
    expect(css).toMatch(/\.shell-rim-backdrop[\s\S]*z-index:\s*2/);
    expect(css).toMatch(/\.shell-rim-canvas[\s\S]*z-index:\s*5/);
    expect(css).toMatch(/\.shell-canvas-layer[\s\S]*z-index:\s*11/);
    expect(shellSource.indexOf("ShellRimBackdrop")).toBeLessThan(shellSource.indexOf("shell-canvas-layer"));
  });
});
