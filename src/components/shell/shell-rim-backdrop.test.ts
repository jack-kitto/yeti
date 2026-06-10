import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("shell rim backdrop", () => {
  const css = readFileSync(resolve(__dirname, "../../app/globals.css"), "utf8");
  const shellSource = readFileSync(resolve(__dirname, "./shell.tsx"), "utf8");

  it("blurs the wallpaper through the shell ring for frosted modes", () => {
    expect(css).toContain(".shell-rim-backdrop-fill");
    expect(css).toMatch(/\.shell-rim-backdrop-fill[\s\S]*backdrop-filter/);
    expect(shellSource).toContain("ShellRimBackdrop");
  });
});
